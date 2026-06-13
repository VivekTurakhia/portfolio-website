import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../state/useStore'
import { movieClips } from '../data/movieClips'

const VIDEO_ASPECT = 16 / 9

/**
 * The TV's screen face. Before the TV is first activated it renders the original
 * dark `tvscreen` material from the GLB; once activated it becomes a live
 * VideoTexture playing the favourite-films cycle. The <video> element is created
 * only on activation, so the (large) clip files aren't fetched until someone
 * actually clicks the TV — and once on, the TV stays on (no power-off).
 *
 * Power-on: the screen opens from a centre line, expanding up + down (the mesh's
 * scale.y springs 0 → 1). The geometry is recentred at its bounding-box centre so
 * that vertical scaling pivots about the middle of the screen.
 *
 * The GLB face has no usable UVs, so we also generate planar UVs scaled so the
 * 16:9 video *covers* the face (like CSS object-fit: cover).
 */
export function TvScreen({ geometry, fallbackMaterial }) {
  const tvOn = useStore((s) => s.tvOn)
  const tvClipIndex = useStore((s) => s.tvClipIndex)
  // Power-on waits until the camera has actually arrived at the TV view.
  const tvArrived = useStore((s) => s.currentView === 'tv' && s.cameraSettled)

  // Planar-UV'd, centre-pivoted copy of the screen geometry (computed once).
  const { screenGeometry, center } = useMemo(() => {
    const g = geometry.clone()
    g.computeBoundingBox()
    const bb = g.boundingBox
    const size = new THREE.Vector3()
    bb.getSize(size)

    // The two largest local axes span the screen plane; the smallest is depth.
    const dims = [
      { axis: 'x', len: size.x },
      { axis: 'y', len: size.y },
      { axis: 'z', len: size.z },
    ].sort((a, b) => b.len - a.len)
    const uAxis = dims[0].axis // widest -> horizontal
    const vAxis = dims[1].axis

    // object-fit: cover — scale UVs so the video fills the face, cropping excess.
    const faceAspect = dims[0].len / dims[1].len
    let uScale = 1
    let vScale = 1
    if (faceAspect > VIDEO_ASPECT) vScale = VIDEO_ASPECT / faceAspect
    else uScale = faceAspect / VIDEO_ASPECT

    const pos = g.attributes.position
    const uv = new Float32Array(pos.count * 2)
    for (let i = 0; i < pos.count; i++) {
      const p = { x: pos.getX(i), y: pos.getY(i), z: pos.getZ(i) }
      const u = (p[uAxis] - bb.min[uAxis]) / size[uAxis]
      // Invert V: with flipY=false the image's top row sits at v=0, and our v=0
      // is the screen's bottom edge — without this the picture is upside down.
      const v = 1 - (p[vAxis] - bb.min[vAxis]) / size[vAxis]
      uv[i * 2] = (u - 0.5) / uScale + 0.5
      uv[i * 2 + 1] = (v - 0.5) / vScale + 0.5
    }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))

    // Recentre at the bbox centre so the mesh can be re-placed there and scaled
    // about the screen's middle.
    const c = new THREE.Vector3()
    bb.getCenter(c)
    g.translate(-c.x, -c.y, -c.z)
    return { screenGeometry: g, center: [c.x, c.y, c.z] }
  }, [geometry])

  // One <video> element for the TV's lifetime, created on first activation.
  const video = useMemo(() => {
    if (!tvOn) return null
    const v = document.createElement('video')
    v.playsInline = true
    v.preload = 'auto'
    v.crossOrigin = 'anonymous'
    return v
  }, [tvOn])

  const texture = useMemo(() => {
    if (!video) return null
    const t = new THREE.VideoTexture(video)
    t.colorSpace = THREE.SRGBColorSpace
    t.flipY = false // glTF-convention geometry: V runs top-down.
    t.wrapS = THREE.ClampToEdgeWrapping
    t.wrapT = THREE.ClampToEdgeWrapping
    return t
  }, [video])

  // Built imperatively and passed via the `material` prop: swapping a mesh from a
  // `material` prop to a JSX child <meshBasicMaterial> hits an R3F reconciliation
  // edge case where the child's props never apply. A concrete material avoids it.
  const videoMaterial = useMemo(() => {
    if (!texture) return null
    return new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
  }, [texture])

  // `opened` latches true once the first frame is decodable, kicking off the
  // power-on. It never resets, so swapping clips later doesn't re-animate.
  const [ready, setReady] = useState(false)
  const [opened, setOpened] = useState(false)
  useEffect(() => {
    if (ready && tvArrived) setOpened(true)
  }, [ready, tvArrived])

  // Drive the playlist: load + play current clip; advance the cycle when it ends.
  useEffect(() => {
    if (!video) return
    setReady(false)
    video.src = movieClips[tvClipIndex].src
    video.play().catch(() => {
      // Autoplay-with-sound can be blocked without a fresh user gesture; fall
      // back to muted, then unmute on the next interaction anywhere.
      video.muted = true
      video.play().catch(() => {})
      const unmute = () => {
        video.muted = false
        if (video.paused) video.play().catch(() => {})
      }
      window.addEventListener('pointerdown', unmute, { once: true })
    })
    const onLoaded = () => setReady(true)
    const onEnded = () => useStore.getState().tvAdvance(movieClips.length)
    video.addEventListener('loadeddata', onLoaded)
    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('loadeddata', onLoaded)
      video.removeEventListener('ended', onEnded)
    }
  }, [video, tvClipIndex])

  // Teardown on unmount: stop fetching/decoding and free the GPU texture.
  useEffect(() => {
    if (!video) return
    return () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
      texture?.dispose()
    }
  }, [video, texture])

  useEffect(() => {
    if (!videoMaterial) return
    return () => videoMaterial.dispose()
  }, [videoMaterial])

  // Start collapsed; spring scale.y toward the open target each frame.
  const meshRef = useRef(null)
  const attachMesh = useCallback((m) => {
    meshRef.current = m
    if (m) m.scale.y = 0
  }, [])
  useFrame((_, dt) => {
    const m = meshRef.current
    if (!m) return
    const target = opened ? 1 : 0
    m.scale.y = THREE.MathUtils.damp(m.scale.y, target, 9, dt)
    if (Math.abs(m.scale.y - target) < 0.001) m.scale.y = target
  })

  // Before activation, the plain dark screen (and it never re-fetches the clips).
  if (!tvOn || !videoMaterial) {
    return <mesh geometry={geometry} material={fallbackMaterial} />
  }
  // Video mesh mounts immediately on activation but stays collapsed (scale.y 0,
  // hiding the pre-decode flash) until `opened` springs it up + down.
  return <mesh ref={attachMesh} geometry={screenGeometry} position={center} material={videoMaterial} />
}
