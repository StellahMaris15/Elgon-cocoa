import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";
import type { Group } from "three";



const Pod = ({ position, rotation, color }: { position: [number, number, number]; rotation: [number, number, number]; color: string }) => (
  <mesh position={position} rotation={rotation} castShadow>
    <capsuleGeometry args={[0.13, 1.7, 8, 20]} />
    <meshStandardMaterial color={color} roughness={0.35} metalness={0.08} />
  </mesh>
);

const Bean = ({ position, scale = 1, color }: { position: [number, number, number]; scale?: number; color: string }) => (
  <mesh position={position} scale={[scale, scale * 0.62, scale * 0.74]} castShadow>
    <sphereGeometry args={[0.42, 24, 24]} />
    <meshStandardMaterial color={color} roughness={0.5} />
  </mesh>
);

const CocoaPod = ({ position }: { position: [number, number, number] }) => (
  <group position={position} rotation={[0, 0, 0.35]}>
    <mesh castShadow scale={[1, 1.6, 1]}>
      <sphereGeometry args={[0.62, 32, 32]} />
      <meshStandardMaterial color="#A9541F" roughness={0.55} />
    </mesh>
    {Array.from({ length: 8 }).map((_, i) => (
      <mesh key={i} rotation={[0, (i / 8) * Math.PI * 2, 0]} scale={[1, 1.58, 1]}>
        <torusGeometry args={[0.61, 0.025, 6, 40, Math.PI]} />
        <meshStandardMaterial color="#6B3313" roughness={0.7} />
      </mesh>
    ))}
  </group>
);

const Scene = () => {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  const beans = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return {
          position: [Math.cos(a) * 2.1, Math.sin(a * 1.7) * 0.7, Math.sin(a) * 2.1] as [number, number, number],
          scale: 0.75 + (i % 3) * 0.16,
          color: i % 2 ? "#7A4A22" : "#4A2C12",
        };
      }),
    [],
  );

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.6}>
        <group position={[-1.6, 0.1, 0]} rotation={[0, 0, 0.2]}>
          <Pod position={[-0.2, 0, 0]} rotation={[0, 0, 0.18]} color="#2B1B12" />
          <Pod position={[0.15, 0.05, 0.2]} rotation={[0, 0, -0.1]} color="#3A2416" />
          <mesh position={[0, -0.95, 0.1]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.42, 0.05, 10, 32]} />
            <meshStandardMaterial color="#C9A227" roughness={0.3} metalness={0.65} />
          </mesh>
        </group>
      </Float>

      <Float speed={1.1} rotationIntensity={0.7} floatIntensity={0.8}>
        <CocoaPod position={[1.7, 0.05, -0.2]} />
      </Float>

      {beans.map((b, i) => (
        <Float key={i} speed={1 + (i % 3) * 0.3} rotationIntensity={1.1} floatIntensity={0.9}>
          <Bean {...b} />
        </Float>
      ))}

      <ContactShadows position={[0, -2.1, 0]} opacity={0.3} scale={12} blur={3} far={5} />
    </group>
  );
};

/** Detects devices that should not run a WebGL canvas. */
const useCanRender3D = () => {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const smallMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setOk(webgl && !reduced && cores >= 4 && (smallMemory === undefined || smallMemory >= 4));
  }, []);
  return ok;
};

export const Hero3DScene = () => {
  const canRender = useCanRender3D();

  if (canRender !== true) {
    // Graceful degradation: a static gradient veil, no WebGL cost at all.
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,hsl(var(--gold)/0.28),transparent_58%)]"
      />
    );
  }

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      className="absolute inset-0"
    >
      <Canvas
        dpr={[1, 1.6]}
        frameloop="always"
        camera={{ position: [0, 0.4, 7], fov: 42 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 6, 4]} intensity={1.5} />
          <directionalLight position={[-5, 1, -3]} intensity={0.4} color="#C9A227" />
          <Scene />
          <pointLight position={[-3, 2, 3]} intensity={0.5} color="#ffe1b0" />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};
