import React, { Suspense, useMemo } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import { Interactive } from './Interactive'
import { useStore } from '../state/useStore'

const ExperiencesScreen = React.lazy(() => import('../ui/ExperiencesScreen'))

const MODEL_URL = '/models/lowpolyroom1.glb'

/**
 * The bedroom. Structure was generated with gltfjsx from the GLB, then
 * refactored: interactive objects are wrapped in <Interactive id="...">, the
 * Blender backdrop (`renderplane`) is dropped, and monitor1 carries the on-screen
 * HTML page.
 *
 * Note: gltfjsx keys geometry by mesh-data name (Plane001, Cube003, ...), not the
 * semantic node name. Mapping confirmed from the GLB:
 *   monitor1 = Plane001*, monitor2 = Plane002*, speakers1 = Cube003*,
 *   speakers2 = Cube004*, bed = Cube007*, tv = Cube002*.
 */
// Multiplier for Blender-exported light intensities. glTF stores point/spot in
// candela and sun in lux; combined with three's physically-correct lighting the
// values often need scaling. Tune this after re-exporting.
const GLB_LIGHT_INTENSITY = 1

export function Room(props) {
  const { nodes, materials, scene } = useGLTF(MODEL_URL)

  // Collect punctual lights authored in Blender (KHR_lights_punctual). They live
  // in the loaded glTF scene graph; since we render the meshes by hand (for the
  // interaction wrappers), we mount the lights explicitly here.
  const lights = useMemo(() => {
    const found = []
    scene.traverse((o) => {
      if (o.isLight) {
        o.intensity *= GLB_LIGHT_INTENSITY
        found.push(o)
      }
    })
    return found
  }, [scene])

  return (
    <group {...props} dispose={null}>
      {/* Blender lights (if the GLB was exported with Punctual Lights). */}
      {lights.map((l) => (
        <primitive key={l.uuid} object={l} />
      ))}

      {/* Lighting recreated from the Blender scene. The GLB export dropped the
          actual light data (Punctual Lights wasn't enabled on export), so these
          reproduce it: a warm key plus the pink/blue fill lights. Positions are
          taken from the exported `renderlight_*` node transforms; decay={0} makes
          intensity distance-independent (the originals sit far outside the room),
          so you can tune purely by `intensity`/`color`. Replaced automatically if
          a lights-enabled GLB is ever loaded. */}
      {lights.length === 0 && (
        <>
          <directionalLight position={[3, 5, 4]} intensity={1.2} color="#fff4e6" />
          {/* renderlight_pink */}
          <pointLight position={[-1.088, 1.727, -13.114]} intensity={1.6} decay={0} color="#ff5ea8" />
          {/* renderlight_blue */}
          <pointLight position={[-13.088, 1.727, -1.114]} intensity={1.6} decay={0} color="#4aa3ff" />
        </>
      )}

      {/* table */}
      <group position={[-0.34, 0.229, -0.697]}>
        <mesh geometry={nodes.Plane.geometry} material={materials.metallic} />
        <mesh geometry={nodes.Plane_1.geometry} material={materials.black_wood} />
      </group>

      {/* monitor1 — interactive: zooms to the experiences screen */}
      <Interactive id="monitor1">
        <group position={[-0.321, 0.511, -0.857]} rotation={[Math.PI / 2, 0, -0.007]} scale={0.133}>
          <mesh geometry={nodes.Plane001.geometry} material={materials.blackplastic} />
          <mesh geometry={nodes.Plane001_1.geometry} material={materials.metallicplastic} />
          <mesh geometry={nodes.Plane001_2.geometry} material={materials.monitor1} />
        </group>
      </Interactive>

      {/* monitor2 (static for now) */}
      <group position={[0.078, 0.501, -0.82]} rotation={[0, -0.182, 0]}>
        <mesh geometry={nodes.Plane002.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Plane002_1.geometry} material={materials.metallicplastic} />
        <mesh geometry={nodes.Plane002_2.geometry} material={materials.emission_blue} />
        <mesh geometry={nodes.Plane002_3.geometry} material={materials.monitor2} />
      </group>

      {/* pc tower */}
      <group position={[-0.732, 0.626, -0.841]} rotation={[0, -0.01, 0]} scale={0.108}>
        <mesh geometry={nodes.Cube001.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Cube001_1.geometry} material={materials.emission_blue} />
        <mesh geometry={nodes.Cube001_2.geometry} material={materials.metallic} />
        <mesh geometry={nodes.Cube001_3.geometry} material={materials.motherboard_green} />
        <mesh geometry={nodes.Cube001_4.geometry} material={materials.emission_red_lite} />
        <mesh geometry={nodes.Cube001_5.geometry} material={materials.metallicplastic} />
        <mesh geometry={nodes.Cube001_6.geometry} material={materials.emission_pink} />
        <mesh geometry={nodes.Cube001_7.geometry} material={materials.wall} />
      </group>

      {/* speakers1 — interactive: toggle music */}
      <Interactive id="speakers1">
        <group position={[-0.312, 0.486, -0.776]} scale={0.02}>
          <mesh geometry={nodes.Cube003.geometry} material={materials.blackplastic} />
          <mesh geometry={nodes.Cube003_1.geometry} material={materials.metallicplastic} />
          <mesh geometry={nodes.Cube003_2.geometry} material={materials.emission_green} />
        </group>
      </Interactive>

      {/* keyboard / mousepad */}
      <group position={[-0.329, 0.457, -0.774]} rotation={[0, 0.027, 0]} scale={[0.099, 0.083, 0.083]}>
        <mesh geometry={nodes.Plane021.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Plane021_1.geometry} material={materials.emission_red} />
        <mesh geometry={nodes.Plane021_2.geometry} material={materials.emission_pink} />
        <mesh geometry={nodes.Plane021_3.geometry} material={materials.mousepad} />
        <mesh geometry={nodes.Plane021_4.geometry} material={materials.emission_blue} />
        <mesh geometry={nodes.Plane021_5.geometry} material={materials.emission_green} />
        <mesh geometry={nodes.Plane021_6.geometry} material={materials.emission_orange} />
        <mesh geometry={nodes.Plane021_7.geometry} material={materials.emission_purple} />
      </group>

      {/* posters */}
      <group position={[-0.214, 1.036, -0.997]} rotation={[Math.PI / 2, 0, 0]} scale={0.089}>
        <mesh geometry={nodes.Plane022.geometry} material={materials.bbposter} />
        <mesh geometry={nodes.Plane022_1.geometry} material={materials.metallic} />
        <mesh geometry={nodes.Plane022_2.geometry} material={materials.plasticred} />
        <mesh geometry={nodes.Plane022_3.geometry} material={materials.xfilesposter} />
        <mesh geometry={nodes.Plane022_4.geometry} material={materials.stposter} />
      </group>

      <mesh geometry={nodes.shelving.geometry} material={materials.metallicplastic} position={[0.656, 0.728, -0.764]} scale={0.143} />

      {/* trashcan */}
      <group position={[-0.712, 0.121, -0.719]} scale={0.104}>
        <mesh geometry={nodes.Cylinder004.geometry} material={materials.trashbucket} />
        <mesh geometry={nodes.Cylinder004_1.geometry} material={materials.wall} />
      </group>

      {/* walls */}
      <group position={[0.068, 0.013, 0.006]} scale={0.056}>
        <mesh geometry={nodes.Cube011.geometry} material={materials.wall} />
        <mesh geometry={nodes.Cube011_1.geometry} material={materials.wall_black} />
        <mesh geometry={nodes.Cube011_2.geometry} material={materials.woodside} />
        <mesh geometry={nodes.Cube011_3.geometry} material={materials.led_emisison_pink} />
        <mesh geometry={nodes.Cube011_4.geometry} material={materials.led_emission_blue} />
      </group>

      <mesh geometry={nodes.blinds.geometry} material={materials.blackplastic} position={[-1.061, 1.421, -0.069]} />

      {/* chair */}
      <group position={[-0.407, 0.268, -0.12]} rotation={[0, 1.203, 0]} scale={0.253}>
        <mesh geometry={nodes.Cylinder015.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Cylinder015_1.geometry} material={materials.metallic} />
      </group>

      {/* router */}
      <group position={[-0.182, 0.877, -0.99]} rotation={[Math.PI / 2, 0, 0]} scale={0.038}>
        <mesh geometry={nodes.Plane025.geometry} material={materials.whiteplastic} />
        <mesh geometry={nodes.Plane025_1.geometry} material={materials.wall} />
        <mesh geometry={nodes.Plane025_2.geometry} material={materials.emission_green} />
      </group>

      <mesh geometry={nodes.wires1.geometry} material={materials.blackplastic} position={[-0.194, 0.663, -0.993]} rotation={[0, 0, -Math.PI / 2]} scale={0.016} />

      {/* tv (static for now) */}
      <group position={[0.631, 0.97, -0.67]} rotation={[0, -0.105, 0]} scale={1.524}>
        <mesh geometry={nodes.Cube002.geometry} material={materials.metallicplastic} />
        <mesh geometry={nodes.Cube002_1.geometry} material={materials.tvscreen} />
        <mesh geometry={nodes.Cube002_2.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Cube002_3.geometry} material={materials.emission_red_lite} />
      </group>

      {/* speakers2 — interactive: toggle music */}
      <Interactive id="speakers2">
        <group position={[0.446, 1.337, -0.719]} rotation={[0, -0.253, 0]} scale={0.06}>
          <mesh geometry={nodes.Cube004.geometry} material={materials.blackplastic} />
          <mesh geometry={nodes.Cube004_1.geometry} material={materials.metallicplastic} />
        </group>
      </Interactive>

      <mesh geometry={nodes.boxes.geometry} material={materials.cardbox} position={[0.825, 1.346, -0.809]} rotation={[0, 0.367, 0]} scale={0.09} />

      {/* wires2 */}
      <group position={[0.471, 0.444, -0.993]} rotation={[Math.PI / 2, 0, 0]} scale={0.007}>
        <mesh geometry={nodes.Cylinder.geometry} material={materials.metallicplastic} />
        <mesh geometry={nodes.Cylinder_1.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Cylinder_2.geometry} material={materials.wall} />
      </group>

      {/* bed (static for now) */}
      <group position={[-0.374, 0.014, 0.767]} scale={0.199}>
        <mesh geometry={nodes.Cube007.geometry} material={materials.darkwood_bed} />
        <mesh geometry={nodes.Cube007_1.geometry} material={materials.cardbox} />
        <mesh geometry={nodes.Cube007_2.geometry} material={materials.metallic} />
        <mesh geometry={nodes.Cube007_3.geometry} material={materials.pillow_blanket} />
        <mesh geometry={nodes.Cube007_4.geometry} material={materials.pillow} />
      </group>

      {/* pc3 */}
      <group position={[0.824, 0.454, -0.87]} rotation={[0, -0.111, 0]} scale={0.072}>
        <mesh geometry={nodes.Cube014.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Cube014_1.geometry} material={materials.metallicplastic} />
        <mesh geometry={nodes.Cube014_2.geometry} material={materials.black_wood} />
      </group>

      {/* pc2 */}
      <group position={[0.52, 0.742, -0.587]} rotation={[0, -0.005, 0]} scale={0.229}>
        <mesh geometry={nodes.Cube016.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Cube016_1.geometry} material={materials.black_wood} />
      </group>

      {/* floor (renderplane backdrop intentionally omitted) */}
      <mesh geometry={nodes.floor.geometry} material={materials.floor} position={[0.068, 0.013, 0.006]} scale={0.056} />

      {/* The experiences "website" rendered onto monitor1's screen. */}
      <MonitorScreen />
    </group>
  )
}

/**
 * drei <Html transform> projects real DOM onto a plane in 3D space. Positioned/
 * rotated/scaled to sit on monitor1's screen face. Pointer events are enabled
 * only when the monitor view is active so the page isn't clickable from afar.
 *
 * The position/rotation/scale below are first-pass guesses — tune visually.
 */
function MonitorScreen() {
  const active = useStore((s) => s.currentView === 'monitor1')

  return (
    <Html
      transform
      position={[-0.321, 0.52, -0.78]}
      rotation={[0, -0.007, 0]}
      scale={0.07}
      zIndexRange={[10, 0]}
      style={{ pointerEvents: active ? 'auto' : 'none' }}
    >
      <div className="monitor-screen" data-active={active}>
        <Suspense fallback={<div className="screen-loading">…</div>}>
          <ExperiencesScreen />
        </Suspense>
      </div>
    </Html>
  )
}

useGLTF.preload(MODEL_URL)
