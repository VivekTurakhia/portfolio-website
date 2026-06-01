import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/web'
import { Avatar } from '../scene/Avatar'
import { useStore } from '../state/useStore'

/**
 * Purple intro overlay shown on top of everything. Contains a small transparent
 * Canvas with the avatar waving, plus the welcome text behind it. While the main
 * scene loads, the Enter button reads "Loading…"; once `sceneLoaded` flips, it
 * becomes "Enter". Clicking enter() starts the music and slides this overlay off
 * to the left, revealing the room.
 */
export function Intro() {
  const sceneLoaded = useStore((s) => s.sceneLoaded)
  const introDone = useStore((s) => s.introDone)
  const enter = useStore((s) => s.enter)

  const slide = useSpring({
    transform: introDone ? 'translateX(-100%)' : 'translateX(0%)',
    config: { tension: 90, friction: 26 },
  })

  return (
    <animated.div
      className="intro"
      style={{ ...slide, pointerEvents: introDone ? 'none' : 'auto' }}
      aria-hidden={introDone}
    >
      <h1 className="intro-title">Welcome to Vivek&apos;s Website</h1>

      <div className="intro-canvas">
        <Canvas camera={{ position: [0, 1.45, 3], fov: 35 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 3, 2]} intensity={1.6} />
          <Suspense fallback={null}>
            {/* rotate 180° so the avatar faces the camera (cancels the model's
                intrinsic back-facing rotation used for desk-typing). */}
            <Avatar animation="Waving" position={[0, -0.85, 0]} rotation={[0, Math.PI, 0]} />
          </Suspense>
        </Canvas>
      </div>

      <button className="intro-enter" onClick={enter} disabled={!sceneLoaded}>
        {sceneLoaded ? 'Enter' : 'Loading…'}
      </button>
    </animated.div>
  )
}
