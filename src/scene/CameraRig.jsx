import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useSpring } from '@react-spring/three'
import { Vector3 } from 'three'
import { useStore } from '../state/useStore'
import { views, DEFAULT_VIEW } from './views'

const _target = new Vector3()

/**
 * Fixed-view camera. There is no OrbitControls — the camera only moves between
 * named presets (views.js). Switching `currentView` springs both the camera
 * position and its lookAt target to the new preset.
 *
 * Scalar springs (px/py/pz, tx/ty/tz) are used instead of array springs so the
 * interpolation is rock-solid and easy to read each frame.
 */
export function CameraRig() {
  const camRef = useRef()
  const currentView = useStore((s) => s.currentView)
  const start = views[DEFAULT_VIEW]

  const [spring, api] = useSpring(() => ({
    px: start.position[0], py: start.position[1], pz: start.position[2],
    tx: start.target[0], ty: start.target[1], tz: start.target[2],
    config: { mass: 1, tension: 120, friction: 30 },
  }))

  useEffect(() => {
    const v = views[currentView] ?? views[DEFAULT_VIEW]
    api.start({
      px: v.position[0], py: v.position[1], pz: v.position[2],
      tx: v.target[0], ty: v.target[1], tz: v.target[2],
    })
  }, [currentView, api])

  useFrame(() => {
    const cam = camRef.current
    if (!cam) return
    cam.position.set(spring.px.get(), spring.py.get(), spring.pz.get())
    _target.set(spring.tx.get(), spring.ty.get(), spring.tz.get())
    cam.lookAt(_target)
  })

  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      fov={50}
      near={0.1}
      far={100}
      position={start.position}
    />
  )
}
