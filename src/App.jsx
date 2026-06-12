import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Outline, Selection } from '@react-three/postprocessing'
import { Room } from './scene/Room.jsx'
import { Avatar } from './scene/Avatar.jsx'
import { CameraRig } from './scene/CameraRig.jsx'
import { NavBar } from './ui/NavBar.jsx'
import { Intro } from './ui/Intro.jsx'
import { BackButton } from './ui/BackButton.jsx'
import { TvOverlay } from './ui/TvOverlay.jsx'
import { AudioController } from './ui/AudioController.jsx'
import { useStore } from './state/useStore.js'

/**
 * Mounted inside <Suspense> alongside the scene, so its effect fires only once
 * the GLB/FBX assets have resolved. That flips `sceneLoaded`, which un-gates the
 * intro's Enter button.
 */
function SceneReadySignal() {
  const setSceneLoaded = useStore((s) => s.setSceneLoaded)
  useEffect(() => {
    setSceneLoaded(true)
  }, [setSceneLoaded])
  return null
}

export default function App() {
  return (
    <div className="app">
      <NavBar />

      <div className="canvas-wrap">
        <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={['#15131f']} />

          {/* Stand-in for Blender's world ambient: a near-black neutral fill
              (the .blend world is grey ~0.05), just enough that surfaces facing
              away from both area lights aren't pure black. The two colored area
              lights that define the look live in Room.jsx. */}
          <ambientLight intensity={0.18} color="#2a2730" />

          <CameraRig />

          {/* One Selection/Outline pass at the top level. Selectable meshes
              (via <Interactive>) live inside this same <Selection>. */}
          <Selection>
            <EffectComposer autoClear={false} multisampling={4}>
              <Outline
                blur
                edgeStrength={6}
                visibleEdgeColor={0xffffff}
                hiddenEdgeColor={0xffffff}
              />
            </EffectComposer>

            <Suspense fallback={null}>
              <Room />
              {/* Position is a sensible default — fine-tune to seat the avatar at the desk. */}
              <Avatar animation="Typing" position={[-0.4, 0.3, -0.1]} />
              <SceneReadySignal />
            </Suspense>
          </Selection>
        </Canvas>

        <BackButton />
        <TvOverlay />
      </div>

      <Intro />
      <AudioController />
    </div>
  )
}
