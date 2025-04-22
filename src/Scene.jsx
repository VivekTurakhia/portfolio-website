import { useGLTF, PerspectiveCamera, Html } from "@react-three/drei";
import {
  EffectComposer,
  Outline,
  Select,
  Selection,
} from "@react-three/postprocessing";
import { useRef, useState } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useHover } from "./tools/useHover";

export function Scene({ props }) {
  const { nodes, materials } = useGLTF('../models/lowpolyroom1.glb')
  const monitor1 = useHover();
  const monitor2 = useHover();
  const bed = useHover();
  const speakers = useHover();

  return (
    <group {...props} dispose={null}>
      <group position={[-0.34, 0.229, -0.697]}>
        <mesh geometry={nodes.Plane.geometry} material={materials.metallic} />
        <mesh geometry={nodes.Plane_1.geometry} material={materials.black_wood} />
      </group>
      <Selection>
        <EffectComposer autoClear={false}>
          <Outline blur edgeStrength={100} visibleEdgeColor={0xffffff} />
        </EffectComposer>

        <Select enabled={monitor1.hovered}>
          <group position={[-0.321, 0.511, -0.857]} rotation={[Math.PI / 2, 0, -0.007]} scale={0.133} ref={monitor1.ref} onPointerOver={monitor1.onPointerOver} onPointerOut={monitor1.onPointerOut}>
            <mesh geometry={nodes.Plane001.geometry} material={materials.blackplastic} />
            <mesh geometry={nodes.Plane001_1.geometry} material={materials.metallicplastic} />
            <mesh geometry={nodes.Plane001_2.geometry} material={materials.monitor1} />
          </group>
        </Select>

        <Select enabled={monitor2.hovered}>
          <group position={[0.078, 0.501, -0.82]} rotation={[0, -0.182, 0]} ref={monitor2.ref} onPointerOver={monitor2.onPointerOver} onPointerOut={monitor2.onPointerOut}>
            <mesh geometry={nodes.Plane002.geometry} material={materials.blackplastic} />
            <mesh geometry={nodes.Plane002_1.geometry} material={materials.metallicplastic} />
            <mesh geometry={nodes.Plane002_2.geometry} material={materials.emission_blue} />
            <mesh geometry={nodes.Plane002_3.geometry} material={materials.monitor2} />
          </group>
        </Select>

        <Select enabled={speakers.hovered}>
          <group position={[0.446, 1.337, -0.719]} rotation={[0, -0.253, 0]} scale={0.06} ref={speakers.ref} onPointerOver={speakers.onPointerOver} onPointerOut={speakers.onPointerOut}>
            <mesh geometry={nodes.Cube004.geometry} material={materials.blackplastic} />
            <mesh geometry={nodes.Cube004_1.geometry} material={materials.metallicplastic} />
          </group>
        </Select>

        <Select enabled={bed.hovered}>
          <group position={[-0.374, 0.014, 0.767]} scale={0.199} ref={bed.ref} onPointerOver={bed.onPointerOver} onPointerOut={bed.onPointerOut}>
            <mesh geometry={nodes.Cube007.geometry} material={materials.darkwood_bed} />
            <mesh geometry={nodes.Cube007_1.geometry} material={materials.cardbox} />
            <mesh geometry={nodes.Cube007_2.geometry} material={materials.metallic} />
            <mesh geometry={nodes.Cube007_3.geometry} material={materials.pillow_blanket} />
            <mesh geometry={nodes.Cube007_4.geometry} material={materials.pillow} />
          </group>
        </Select>
      </Selection>

      <group position={[-0.407, 0.268, -0.12]} rotation={[0, 1.203, 0]} scale={0.253}>
            <mesh geometry={nodes.Cylinder015.geometry} material={materials.blackplastic} />
            <mesh geometry={nodes.Cylinder015_1.geometry} material={materials.metallic} />
      </group>
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
      <group position={[-0.312, 0.486, -0.776]} scale={0.02}>
        <mesh geometry={nodes.Cube003.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Cube003_1.geometry} material={materials.metallicplastic} />
        <mesh geometry={nodes.Cube003_2.geometry} material={materials.emission_green} />
      </group>
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
      <group position={[-0.214, 1.036, -0.997]} rotation={[Math.PI / 2, 0, 0]} scale={0.089}>
        <mesh geometry={nodes.Plane022.geometry} material={materials.bbposter} />
        <mesh geometry={nodes.Plane022_1.geometry} material={materials.metallic} />
        <mesh geometry={nodes.Plane022_2.geometry} material={materials.plasticred} />
        <mesh geometry={nodes.Plane022_3.geometry} material={materials.xfilesposter} />
        <mesh geometry={nodes.Plane022_4.geometry} material={materials.stposter} />
      </group>
      <mesh geometry={nodes.shelving.geometry} material={materials.metallicplastic} position={[0.656, 0.728, -0.764]} scale={0.143} />
      <group position={[-0.712, 0.121, -0.719]} scale={0.104}>
        <mesh geometry={nodes.Cylinder004.geometry} material={materials.trashbucket} />
        <mesh geometry={nodes.Cylinder004_1.geometry} material={materials.wall} />
      </group>
      <group position={[0.068, 0.013, 0.006]} scale={0.056}>
        <mesh geometry={nodes.Cube011.geometry} material={materials.wall} />
        <mesh geometry={nodes.Cube011_1.geometry} material={materials.wall_black} />
        <mesh geometry={nodes.Cube011_2.geometry} material={materials.woodside} />
        <mesh geometry={nodes.Cube011_3.geometry} material={materials.led_emisison_pink} />
        <mesh geometry={nodes.Cube011_4.geometry} material={materials.led_emission_blue} />
      </group>
      <mesh geometry={nodes.blinds.geometry} material={materials.blackplastic} position={[-1.061, 1.421, -0.069]} />

      <group position={[-0.182, 0.877, -0.99]} rotation={[Math.PI / 2, 0, 0]} scale={0.038}>
        <mesh geometry={nodes.Plane025.geometry} material={materials.whiteplastic} />
        <mesh geometry={nodes.Plane025_1.geometry} material={materials.wall} />
        <mesh geometry={nodes.Plane025_2.geometry} material={materials.emission_green} />
      </group>
      <mesh geometry={nodes.wires1.geometry} material={materials.blackplastic} position={[-0.194, 0.663, -0.993]} rotation={[0, 0, -Math.PI / 2]} scale={0.016} />
      <group position={[0.631, 0.97, -0.67]} rotation={[0, -0.105, 0]} scale={1.524}>
        <mesh geometry={nodes.Cube002.geometry} material={materials.metallicplastic} />
        <mesh geometry={nodes.Cube002_1.geometry} material={materials.tvscreen} />
        <mesh geometry={nodes.Cube002_2.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Cube002_3.geometry} material={materials.emission_red_lite} />
      </group>

      <mesh geometry={nodes.boxes.geometry} material={materials.cardbox} position={[0.825, 1.346, -0.809]} rotation={[0, 0.367, 0]} scale={0.09} />
      <group position={[0.471, 0.444, -0.993]} rotation={[Math.PI / 2, 0, 0]} scale={0.007}>
        <mesh geometry={nodes.Cylinder.geometry} material={materials.metallicplastic} />
        <mesh geometry={nodes.Cylinder_1.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Cylinder_2.geometry} material={materials.wall} />
      </group>
      <group position={[0.824, 0.454, -0.87]} rotation={[0, -0.111, 0]} scale={0.072}>
        <mesh geometry={nodes.Cube014.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Cube014_1.geometry} material={materials.metallicplastic} />
        <mesh geometry={nodes.Cube014_2.geometry} material={materials.black_wood} />
      </group>
      <group position={[0.52, 0.742, -0.587]} rotation={[0, -0.005, 0]} scale={0.229}>
        <mesh geometry={nodes.Cube016.geometry} material={materials.blackplastic} />
        <mesh geometry={nodes.Cube016_1.geometry} material={materials.black_wood} />
      </group>
      <mesh geometry={nodes.floor.geometry} material={materials.floor} position={[0.068, 0.013, 0.006]} scale={0.056} />
    </group>
  );
}

useGLTF.preload('../models/lowpolyroom1.glb')
