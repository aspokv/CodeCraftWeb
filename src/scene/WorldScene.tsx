import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  AdaptiveDpr,
  PerformanceMonitor,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import { MODEL_CONFIG, type SceneState } from "./config";
const target = new THREE.Vector3();
function World({ state, mobile }: { state: SceneState; mobile: boolean }) {
  const { scene } = useGLTF(MODEL_CONFIG.url, MODEL_CONFIG.dracoPath);
  const model = useMemo(() => {
    const copy = (scene.getObjectByName("CodeCraft_World") ?? scene).clone(
      true,
    );
    copy.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.material = (o.material as THREE.MeshStandardMaterial).clone();
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return copy;
  }, [scene]);
  const group = useRef<THREE.Group>(null);
  const tower = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const parts = useMemo(
    () =>
      model.children.map((object) => ({
        object,
        home: object.position.clone(),
        layer: Number(object.userData.layer ?? 1),
      })),
    [model],
  );
  useEffect(() => {
    model.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        const mat = o.material as THREE.MeshStandardMaterial;
        if (mat.name === "Crystal") {
          mat.color.set(state.color);
          mat.emissive.set(state.color);
        }
      }
    });
  }, [model, state.color]);
  useFrame((clock, dt) => {
    const delta = Math.min(dt, 0.05);
    const p = state.reduced ? 0.5 : state.progress;
    parts.forEach(({ object, home, layer }) => {
      target.copy(home);
      target.y += (layer - 1) * (state.explode ? 1.6 : 0);
      object.position.lerp(target, 1 - Math.exp(-delta * 5));
    });
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        MODEL_CONFIG.rotation + state.spin + (p - 0.5) * 0.3,
        5,
        delta,
      );
      group.current.position.y = state.reduced
        ? 0
        : Math.sin(clock.clock.elapsedTime * 0.65) * 0.035;
    }
    if (tower.current)
      tower.current.position.y = THREE.MathUtils.damp(
        tower.current.position.y,
        state.explode ? 1.6 : 0,
        5,
        delta,
      );
    target.set(
      mobile ? 8.9 : 8.4,
      8.3,
      (mobile ? 11.3 : 10.5) - (p - 0.5) * 0.5,
    );
    camera.position.lerp(target, 1 - Math.exp(-delta * 3));
    camera.lookAt(0, 0.15, 0);
  });
  return (
    <group ref={group}>
      <primitive object={model} />
      <group ref={tower} position={[0, 0, 0]}>
        {Array.from({ length: state.tower }, (_, i) => (
          <group key={i} position={[0.9, 0.38 + i * 0.38, 0.6]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.8, 0.36, 0.8]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#dfd8c6" : "#c3bda9"}
                roughness={0.9}
              />
            </mesh>
            <mesh position={[0, 0.04, 0.407]}>
              <boxGeometry args={[0.22, 0.2, 0.025]} />
              <meshStandardMaterial
                color="#83bbdd"
                emissive="#78b3cf"
                emissiveIntensity={0.12}
              />
            </mesh>
          </group>
        ))}
        <mesh
          position={[0.9, 0.44 + state.tower * 0.38, 0.6]}
          castShadow
          rotation={[0, Math.PI / 4, 0]}
        >
          <coneGeometry args={[0.7, 0.45, 4]} />
          <meshStandardMaterial color="#546ce0" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
export default function WorldScene({
  state,
  mobile,
}: {
  state: SceneState;
  mobile: boolean;
}) {
  const [dpr, setDpr] = useState(mobile ? 1 : 1.5);
  return (
    <Canvas
      camera={{ position: [8.4, 8.3, 10.5], fov: 38, near: 0.1, far: 60 }}
      dpr={dpr}
      shadows={!mobile}
      gl={{
        antialias: !mobile,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <ambientLight intensity={1.25} />
      <directionalLight position={[3, 8, 5]} intensity={3} color="#fff1d6" />
      <directionalLight
        position={[-5, 4, -3]}
        intensity={1.4}
        color="#daeaff"
      />
      <Suspense fallback={null}>
        <Environment resolution={mobile ? 64 : 128}>
          <Lightformer
            position={[0, 8, 0]}
            intensity={1.5}
            scale={[10, 10, 1]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </Environment>
        <World state={state} mobile={mobile} />
        {!mobile && (
          <ContactShadows
            position={[0, -2.4, 0]}
            opacity={0.18}
            scale={14}
            blur={3}
            far={7}
            frames={1}
            resolution={256}
          />
        )}
      </Suspense>
      <AdaptiveDpr pixelated />
      <PerformanceMonitor onDecline={() => setDpr(1)} />
    </Canvas>
  );
}
