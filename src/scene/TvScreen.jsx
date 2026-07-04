import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../state/useStore'
import { movieClips } from '../data/movieClips'

const VIDEO_ASPECT = 16 / 9

/**
 * The TV's screen face. It shows the dark `tvscreen` material when off, and a
 * live VideoTexture (the favourite-films cycle) while you're viewing it. The
 * <video> element is created on first activation (so the large clips aren't
 * fetched until someone clicks the TV) and persists, but **playback only runs
 * while the TV view is focused** — leaving the view pauses it (stopping the
 * audio) and turns the screen off.
 *
 * Power-on: the screen opens from a centre line, expanding up + down (the mesh's
 * scale.y springs 0 → 1) once the camera has arrived. The geometry is recentred
 * at its bounding-box centre so vertical scaling pivots about the middle.
 *
 * The GLB face has no usable UVs, so we also generate planar UVs scaled so the
 * 16:9 video *covers* the face (like CSS object-fit: cover).
 */
export function TvScreen({ geometry }) {
  const tvOn = useStore((s) => s.tvOn)
  const tvClipIndex = useStore((s) => s.tvClipIndex)
  // True only while the TV view is focused and the camera has arrived — drives
  // both the screen power-on and whether the video is playing.
  const viewing = useStore((s) => s.currentView === 'tv' && s.cameraSettled)

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

  // One <video> for the TV's lifetime, created eagerly (with no src, so no bytes
  // are fetched until activation) and attached to the DOM hidden. iOS requires a
  // DOM-attached element and a play() call inside a tap (see store.tvActivate)
  // before a VideoTexture will update — so the element must exist before the tap.
  const video = useMemo(() => {
    const v = document.createElement('video')
    v.playsInline = true
    v.muted = true
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.preload = 'auto'
    v.crossOrigin = 'anonymous'
    v.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;'
    return v
  }, [])

  useEffect(() => {
    document.body.appendChild(video)
    useStore.getState().registerTvVideo(video)
    return () => {
      useStore.getState().registerTvVideo(null)
      video.pause()
      video.removeAttribute('src')
      video.load()
      video.remove()
    }
  }, [video])

  const texture = useMemo(() => {
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
  const videoMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
    [texture]
  )

  // Dark "powered-off" screen, used whenever the TV isn't being viewed (the
  // GLB's `tvscreen` material is emissive white, which reads as on-but-blank).
  const offMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#0a0a0f', toneMapped: false }),
    []
  )

  // `opened` = screen is on. It tracks `viewing`: it opens once the first frame
  // is ready after the camera arrives, stays open across clip changes, and turns
  // off the moment you leave the view.
  const [ready, setReady] = useState(false)
  const [opened, setOpened] = useState(false)
  useEffect(() => {
    if (!viewing) setOpened(false)
    else if (ready) setOpened(true)
  }, [viewing, ready])

  // Load the current clip once the TV is on, and advance the cycle when it ends.
  // The first clip's src is set inside the tap by store.tvActivate, so skip
  // re-setting it here (that would clobber the in-gesture load on iOS).
  useEffect(() => {
    if (!tvOn) return
    const src = movieClips[tvClipIndex].src
    if (!video.src.endsWith(src)) {
      setReady(false)
      video.src = src
      video.load()
    } else if (video.readyState >= 2) {
      setReady(true) // already loaded by the in-gesture play()
    }
    const onLoaded = () => setReady(true)
    const onEnded = () => useStore.getState().tvAdvance(movieClips.length)
    video.addEventListener('loadeddata', onLoaded)
    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('loadeddata', onLoaded)
      video.removeEventListener('ended', onEnded)
    }
  }, [video, tvOn, tvClipIndex])

  // Unmute + play while viewing; pause (stopping the audio) when the view is left.
  useEffect(() => {
    if (viewing && ready) {
      video.muted = false
      video.play().catch(() => {
        // If unmuted playback is blocked, keep it running muted.
        video.muted = true
        video.play().catch(() => {})
      })
    } else if (!viewing) {
      video.pause()
    }
  }, [viewing, ready, video])

  // Free the GPU texture / material on unmount.
  useEffect(() => () => texture.dispose(), [texture])
  useEffect(() => () => videoMaterial.dispose(), [videoMaterial])

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

  // Off (not activated, or not currently viewing) → the dark powered-off screen.
  if (!tvOn || !opened) {
    return <mesh geometry={geometry} material={offMaterial} />
  }
  // On → the video mesh, mounting collapsed (scale.y 0) and springing open.
  return <mesh ref={attachMesh} geometry={screenGeometry} position={center} material={videoMaterial} />
}
