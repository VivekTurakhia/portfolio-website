import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Scene } from "./Scene.jsx";
import { Avatar } from "./Avatar.jsx";
import { useControls } from "leva";

function App() {
  const { animation } = useControls({
    animation: {
      value: "Typing",
      options: ["Typing", "Waving"]
    },
  })

  return (
    <Canvas
      camera={{ position: [-3, 3, 3], fov: 50 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <Scene />
      <Avatar  animation={animation} />
      <OrbitControls />
    </Canvas>
  );
}

export default App;
