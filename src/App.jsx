import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Outline, Selection } from '@react-three/postprocessing'
import { Room } from './scene/Room.jsx'
import { Avatar } from './scene/Avatar.jsx'
import { CameraRig } from './scene/CameraRig.jsx'
import { NavBar } from './ui/NavBar.jsx'
import { Intro } from './ui/Intro.jsx'
import { BackButton } from './ui/BackButton.jsx'
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

          {/* World/ambient stand-in. glTF can't carry Blender's world ambient,
              so this soft sky/ground fill always stays here. The key/accent
              lights live in Room.jsx — either the Blender-exported punctual
              lights, or a fallback rig when the GLB has none. */}
          <hemisphereLight args={['#aab6ff', '#1a1208', 0.7]} />
          <ambientLight intensity={0.2} />

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
              <Avatar animation="Typing" position={[-0.38, 0.0, 0.02]} />
              <SceneReadySignal />
            </Suspense>
          </Selection>
        </Canvas>

        <BackButton />
      </div>

      <Intro />
      <AudioController />
    </div>
  )
}
