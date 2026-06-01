import React, { useRef, useEffect, useMemo } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useFBX, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

const AVATAR_URL = '/models/avatar.glb'

/**
 * Rigged avatar. Reusable in both the main scene (typing) and the intro
 * (waving) — pass `animation` and place it with standard props (position,
 * rotation, scale) on the outer group.
 *
 * SkeletonUtils.clone() is required so the same loaded GLTF can be instanced
 * more than once (scene + intro) without the two sharing/mutating one skeleton.
 */
export function Avatar({ animation = 'Typing', ...props }) {
  const group = useRef()
  const { scene } = useGLTF(AVATAR_URL)
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)

  // Mixamo animations exported as FBX. (Later optimization: bake these into the
  // GLB to drop the FBX parse cost — out of scope for now.)
  const { animations: typingAnim } = useFBX('/animations/Typing.fbx')
  const { animations: wavingAnim } = useFBX('/animations/Waving.fbx')
  typingAnim[0].name = 'Typing'
  wavingAnim[0].name = 'Waving'

  const { actions } = useAnimations([typingAnim[0], wavingAnim[0]], group)

  useEffect(() => {
    const action = actions[animation]
    if (!action) return
    action.reset().fadeIn(0.4).play()
    return () => {
      action.fadeOut(0.4)
    }
  }, [animation, actions])

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Intrinsic model transform (Mixamo export is huge → scale down). */}
      <group rotation={[0, Math.PI, 0]} scale={0.004}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh geometry={nodes.mesh_3.geometry} material={materials.Color_} skeleton={nodes.mesh_3.skeleton} />
        <skinnedMesh geometry={nodes.mesh_5.geometry} material={materials.Color_} skeleton={nodes.mesh_5.skeleton} />
        <skinnedMesh geometry={nodes.mesh_6.geometry} material={nodes.mesh_6.material} skeleton={nodes.mesh_6.skeleton} />
        <skinnedMesh geometry={nodes.mesh_7.geometry} material={materials.Color_} skeleton={nodes.mesh_7.skeleton} />
        <skinnedMesh geometry={nodes.mesh_8.geometry} material={materials.Glass} skeleton={nodes.mesh_8.skeleton} />
        <skinnedMesh geometry={nodes.mesh_9.geometry} material={materials.Color_} skeleton={nodes.mesh_9.skeleton} />
        <skinnedMesh geometry={nodes.mesh_10.geometry} material={nodes.mesh_10.material} skeleton={nodes.mesh_10.skeleton} />
        <skinnedMesh geometry={nodes.mesh_11.geometry} material={materials.Color_} skeleton={nodes.mesh_11.skeleton} />
        <skinnedMesh geometry={nodes.mesh_12.geometry} material={nodes.mesh_12.material} skeleton={nodes.mesh_12.skeleton} />
        <skinnedMesh geometry={nodes.mesh_13.geometry} material={materials.Color_} skeleton={nodes.mesh_13.skeleton} />
        <skinnedMesh name="mesh_0" geometry={nodes.mesh_0.geometry} material={nodes.mesh_0.material} skeleton={nodes.mesh_0.skeleton} morphTargetDictionary={nodes.mesh_0.morphTargetDictionary} morphTargetInfluences={nodes.mesh_0.morphTargetInfluences} />
        <skinnedMesh name="mesh_1" geometry={nodes.mesh_1.geometry} material={materials.InsideMouth} skeleton={nodes.mesh_1.skeleton} morphTargetDictionary={nodes.mesh_1.morphTargetDictionary} morphTargetInfluences={nodes.mesh_1.morphTargetInfluences} />
        <skinnedMesh name="mesh_2" geometry={nodes.mesh_2.geometry} material={materials.Teeth} skeleton={nodes.mesh_2.skeleton} morphTargetDictionary={nodes.mesh_2.morphTargetDictionary} morphTargetInfluences={nodes.mesh_2.morphTargetInfluences} />
        <skinnedMesh name="mesh_4" geometry={nodes.mesh_4.geometry} material={materials.BlackShiny} skeleton={nodes.mesh_4.skeleton} morphTargetDictionary={nodes.mesh_4.morphTargetDictionary} morphTargetInfluences={nodes.mesh_4.morphTargetInfluences} />
      </group>
    </group>
  )
}

useGLTF.preload(AVATAR_URL)
