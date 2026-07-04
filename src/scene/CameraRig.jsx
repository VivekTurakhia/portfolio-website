import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useSpring } from '@react-spring/three'
import { MathUtils, Vector3 } from 'three'
import { useStore } from '../state/useStore'
import { views, DEFAULT_VIEW } from './views'

const _target = new Vector3()
const _dir = new Vector3()

const BASE_FOV = 50
// Aspect below which we start compensating for the narrow viewport. Desktop
// canvases (e.g. 1280x680 after the nav) sit well above this and are untouched.
// 1.15 (not the actual desktop ~1.9) preserves just the content-critical middle
// of the desktop frame, so phones aren't over-zoomed-out.
const REF_ASPECT = 1.15
// Room: widen the lens at most this much, then dolly back for the rest (keeps
// the room from looking fisheye). Screen views can't dolly (avatar/desk right
// behind), so they get a higher cap to pull the whole flat screen into frame —
// wide-angle on a straight-on flat screen is barely noticeable.
const MAX_FOV_ROOM = 68
const MAX_FOV_SCREEN = 82

/**
 * For viewports narrower than REF_ASPECT, compute the fov + dolly factor that
 * preserve the horizontal extent a REF_ASPECT canvas would see (three.js fov is
 * vertical, so narrow screens crop the sides otherwise). At/above REF_ASPECT
 * this returns the identity ({ fov: BASE_FOV, dolly: 1 }) — desktop unchanged.
 */
function fitNarrowAspect(aspect, maxFov) {
  if (aspect >= REF_ASPECT) return { fov: BASE_FOV, dolly: 1 }
  const needTan = Math.tan(MathUtils.degToRad(BASE_FOV) / 2) * (REF_ASPECT / aspect)
  const maxTan = Math.tan(MathUtils.degToRad(maxFov) / 2)
  if (needTan <= maxTan) return { fov: 2 * MathUtils.radToDeg(Math.atan(needTan)), dolly: 1 }
  return { fov: maxFov, dolly: needTan / maxTan }
}

/**
 * Fixed-view camera. There is no OrbitControls — the camera only moves between
 * named presets (views.js). Switching `currentView` springs both the camera
 * position and its lookAt target to the new preset.
 *
 * Scalar springs (px/py/pz, tx/ty/tz) are used instead of array springs so the
 * interpolation is rock-solid and easy to read each frame.
 *
 * On narrow (phone) viewports the frame loop additionally applies the
 * fitNarrowAspect() compensation so no view is cropped at the sides.
 */
export function CameraRig() {
  const camRef = useRef()
  const size = useThree((s) => s.size)
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
      // The screen power-on waits on this: it fires once the camera has fully
      // arrived at the focused view.
      onRest: () => useStore.getState().setCameraSettled(true),
    })
  }, [currentView, api])

  useFrame(() => {
    const cam = camRef.current
    if (!cam) return

    // The dolly-back is only safe for the room (open space behind the camera).
    // For the tight close-up screen views it would push the camera THROUGH the
    // avatar/desk, so there we compensate with fov only (higher cap), keeping the
    // camera in front of the screen with the avatar behind it.
    const roomView = useStore.getState().currentView === DEFAULT_VIEW
    const { fov, dolly } = fitNarrowAspect(
      size.width / size.height,
      roomView ? MAX_FOV_ROOM : MAX_FOV_SCREEN
    )

    cam.position.set(spring.px.get(), spring.py.get(), spring.pz.get())
    _target.set(spring.tx.get(), spring.ty.get(), spring.tz.get())

    if (roomView && dolly !== 1) {
      _dir.copy(cam.position).sub(_target).multiplyScalar(dolly)
      cam.position.copy(_target).add(_dir)
    }
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov
      cam.updateProjectionMatrix()
    }
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
