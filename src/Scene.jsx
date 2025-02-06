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

export function Scene({ props }) {
  const { nodes, materials } = useGLTF("../models/testbedroom.glb");
  const [targetPosition, setTargetPosition] = useState(null); // Target position for the camera
  const [lookAtTarget, setLookAtTarget] = useState(null); // Target to look at

  const monitorRef = useRef(); // Reference to the monitor group

  // Handle camera movement in each frame
  useFrame(({ camera }) => {
    if (targetPosition) {
      // Smoothly interpolate the camera position
      camera.position.lerp(targetPosition, 0.025);

      // Dynamically make the camera look at the selected target
      if (lookAtTarget) {
        camera.lookAt(lookAtTarget.position);
      }
    }
  });

  const handleObjectClick = (objectRef) => {
    const objectPosition = objectRef.current.position.clone();
    const newCameraPosition = new Vector3(
      objectPosition.x, // Adjust offset as needed
      objectPosition.y,
      objectPosition.z + 1.5
    );

    setTargetPosition(newCameraPosition); // Update the target position
    setLookAtTarget(objectRef.current); // Update the look-at target
  };

  materials["Material #154"].transparent = true;
  materials["Material #154"].opacity = 0.9; // Adjust opacity to make the monitor screen semi-transparent

  return (
    <>
      <group {...props} dispose={null} position={[0, -0.5, 0]}>
        {/* <pointLight intensity={54351.413} decay={2} position={[3.266, 5.896, -1.005]} rotation={[-1.839, 0.602, 1.932]} /> */}
        <PerspectiveCamera
          makeDefault={false}
          far={100}
          near={0.1}
          fov={22.895}
          position={[7.315, 4.95, 6.926]}
          rotation={[-0.627, 0.71, 0.441]}
        />
        <mesh
          geometry={nodes.floor.geometry}
          material={materials["Material #60"]}
        />
        <mesh
          geometry={nodes.shelf1.geometry}
          material={materials["Material #60"]}
        />
        <mesh
          geometry={nodes.shelf2.geometry}
          material={materials["Material #60"]}
        />
        <mesh
          geometry={nodes.keyboard.geometry}
          material={materials["Material #154"]}
        />
        <mesh
          geometry={nodes.mouse.geometry}
          material={materials["Material #154"]}
        />
        <mesh
          geometry={nodes.Mesh.geometry}
          material={materials["Material #25"]}
        />
        <mesh
          geometry={nodes.Mesh_1.geometry}
          material={materials["Material #26"]}
        />
        <mesh
          geometry={nodes.Mesh_2.geometry}
          material={materials["Material #140"]}
        />
        <mesh
          geometry={nodes.Mesh010.geometry}
          material={materials["Material #25"]}
        />
        <mesh
          geometry={nodes.Mesh010_1.geometry}
          material={materials["Material #60"]}
        />
        <mesh
          geometry={nodes.Mesh010_2.geometry}
          material={materials["Material #139"]}
        />
        <mesh
          geometry={nodes.Mesh024.geometry}
          material={materials["Material #25"]}
        />
        <mesh
          geometry={nodes.Mesh024_1.geometry}
          material={materials["Material #62"]}
        />
        <mesh
          geometry={nodes.Mesh024_2.geometry}
          material={materials["Material #63"]}
        />
        <mesh
          geometry={nodes.Mesh024_3.geometry}
          material={materials["Material #65"]}
        />
        <mesh
          geometry={nodes.Mesh024_4.geometry}
          material={materials["Material #66"]}
        />
        <mesh
          geometry={nodes.Mesh024_5.geometry}
          material={materials["Material #67"]}
        />
        <mesh
          geometry={nodes.Mesh024_6.geometry}
          material={materials["Material #61"]}
        />
        <mesh
          geometry={nodes.Mesh024_7.geometry}
          material={materials["Material #26"]}
        />
        <mesh
          geometry={nodes.Mesh032.geometry}
          material={materials["Material #177"]}
        />
        <mesh
          geometry={nodes.Mesh032_1.geometry}
          material={materials["Material #60"]}
        />
        <mesh
          geometry={nodes.Mesh033.geometry}
          material={materials["Material #177"]}
        />
        <mesh
          geometry={nodes.Mesh033_1.geometry}
          material={materials["Material #139"]}
        />
        <mesh
          geometry={nodes.Mesh044.geometry}
          material={materials["Material #154"]}
        />
        <mesh
          geometry={nodes.Mesh044_1.geometry}
          material={materials["Material #139"]}
        />
        <mesh
          geometry={nodes.Mesh044_2.geometry}
          material={materials["Material #25"]}
        />
        <mesh
          geometry={nodes.Mesh051.geometry}
          material={materials["Material #61"]}
        />
        <mesh
          geometry={nodes.Mesh051_1.geometry}
          material={materials["Material #25"]}
        />
        <mesh
          geometry={nodes.Mesh055.geometry}
          material={materials["Material #267"]}
        />
        <mesh
          geometry={nodes.Mesh055_1.geometry}
          material={materials["Material #25"]}
        />
        <mesh
          geometry={nodes.Mesh055_2.geometry}
          material={materials["Material #61"]}
        />
        <mesh
          geometry={nodes.Mesh055_3.geometry}
          material={materials["Material #153"]}
        />
        <mesh
          geometry={nodes.Mesh059.geometry}
          material={materials["Material #177"]}
        />
        <mesh
          geometry={nodes.Mesh059_1.geometry}
          material={materials["Material #26"]}
        />
        <mesh
          geometry={nodes.Mesh059_2.geometry}
          material={materials["Material #153"]}
        />
        <mesh
          geometry={nodes.Mesh060.geometry}
          material={materials["Material #267"]}
        />
        <mesh
          geometry={nodes.Mesh060_1.geometry}
          material={materials["Material #25"]}
        />
        <group
          ref={monitorRef}
          onClick={() => handleObjectClick(monitorRef)}
        >
          <Selection>
            <EffectComposer autoClear={false}>
              <Outline blur edgeStrength={100} visibleEdgeColor={0xffffff} />
            </EffectComposer>
            <Select enabled>
              <mesh
                geometry={nodes.Mesh045.geometry}
                material={materials["Material #154"]}
              />
              {/* <mesh
                geometry={nodes.Mesh045_1.geometry}
                material={materials["Material #139"]}
              /> */}
              <mesh geometry={nodes.Mesh045_1.geometry}>
                <Html
                  className="content"
                  position={[.78, .715, .168]} // Adjust the position to center the content on the monitor
                  rotation-y={-1.3}
                  scale={0.1}
                  transform
                >
                  <div
                    style={{
                      width: "116px", // Adjust width as needed
                      height: "72px", // Adjust height as needed
                      background: "white",
                      border: "2px solid red", // Add a red border to visualize boundaries
                    }}
                  >
                    <h1 style={{ color: "purple", fontSize: "8px" }}>Monitor Content</h1>
                  </div>
                </Html>
              </mesh>
            </Select>
          </Selection>
        </group>
        <mesh
          geometry={nodes.Mesh050.geometry}
          material={materials["Material #154"]}
        />
        <mesh
          geometry={nodes.Mesh050_1.geometry}
          material={materials["Material #139"]}
        />
      </group>
    </>
  );
}

useGLTF.preload("../models/testbedroom.glb");
