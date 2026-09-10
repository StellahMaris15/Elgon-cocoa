import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html } from "@react-three/drei";
import { BackSide, TextureLoader, type Group, type Texture } from "three";
import { RotateCcw, ZoomIn, Move3d, AlertTriangle } from "lucide-react";
import type { CategorySlug } from "@/data/products";
import { cropHero, normalizeImageSource } from "@/data/cropImages";

const TEXTURES: Record<CategorySlug, string> = {
  vanilla: cropHero.vanilla,
  coffee: cropHero.coffee,
  cocoa: cropHero.cocoa,
};

/* ---------------- backdrop built from the bundled crop photography ---------------- */

const PhotoBackdrop = ({ src }: { src: string }) => {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    let active = true;
    const loader = new TextureLoader();
    loader.load(
      src,
      (t) => active && setTexture(t),
      undefined,
      () => active && setTexture(null),
    );
    return () => {
      active = false;
    };
  }, [src]);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, -3.4]} scale={1}>
      <sphereGeometry args={[9, 48, 32]} />
      <meshBasicMaterial map={texture} side={BackSide} toneMapped={false} opacity={0.55} transparent />
    </mesh>
  );
};

/* ---------------- procedural models ---------------- */

const VanillaPod = ({ x = 0, rot = 0 }: { x?: number; rot?: number }) => (
  <group position={[x, 0, 0]} rotation={[0, 0, rot]}>
    <mesh castShadow>
      <capsuleGeometry args={[0.16, 2.1, 12, 32]} />
      <meshStandardMaterial color="#2b1b12" roughness={0.28} metalness={0.12} />
    </mesh>
    {/* subtle ribbing */}
    {Array.from({ length: 6 }).map((_, i) => (
      <mesh key={i} rotation={[0, (i / 6) * Math.PI * 2, 0]}>
        <torusGeometry args={[0.161, 0.006, 4, 24, Math.PI]} />
        <meshStandardMaterial color="#160d08" roughness={0.9} />
      </mesh>
    ))}
  </group>
);

const VanillaModel = () => (
  <group rotation={[0, 0, 0.15]} scale={0.85}>
    <VanillaPod x={-0.75} rot={0.22} />
    <VanillaPod x={-0.25} rot={0.08} />
    <VanillaPod x={0.25} rot={-0.12} />
    <VanillaPod x={0.75} rot={-0.26} />
    <mesh position={[0, -1.25, 0]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.78, 0.07, 12, 48]} />
      <meshStandardMaterial color="#C9A227" roughness={0.28} metalness={0.7} />
    </mesh>
    <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.78, 0.05, 12, 48]} />
      <meshStandardMaterial color="#C9A227" roughness={0.3} metalness={0.7} />
    </mesh>
  </group>
);

const CoffeeBean = ({
  position,
  rotation,
  roasted,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  roasted: boolean;
}) => (
  <group position={position} rotation={rotation}>
    <mesh castShadow scale={[1, 0.62, 0.72]}>
      <sphereGeometry args={[0.55, 40, 40]} />
      <meshStandardMaterial color={roasted ? "#5A3117" : "#9CA96B"} roughness={roasted ? 0.42 : 0.65} />
    </mesh>
    <mesh position={[0, 0.335, 0]} scale={[0.98, 1, 0.1]}>
      <boxGeometry args={[0.92, 0.07, 0.62]} />
      <meshStandardMaterial color={roasted ? "#2C1A0C" : "#6E7A46"} roughness={0.9} />
    </mesh>
  </group>
);

const CoffeeModel = () => (
  <group>
    <CoffeeBean position={[-0.8, 0.1, 0.2]} rotation={[0.2, 0.4, 0.15]} roasted />
    <CoffeeBean position={[0.72, -0.15, -0.3]} rotation={[-0.3, -0.5, -0.2]} roasted={false} />
    <CoffeeBean position={[0, 0.55, -0.1]} rotation={[0.4, 1.1, 0.5]} roasted />
    <CoffeeBean position={[0.12, -0.75, 0.4]} rotation={[-0.1, 2.2, -0.4]} roasted={false} />
    <CoffeeBean position={[-0.55, -0.6, -0.45]} rotation={[0.9, 0.2, 0.7]} roasted />
  </group>
);

const CocoaModel = () => (
  <group rotation={[0, 0, 0.2]}>
    <mesh castShadow scale={[1, 1.65, 1]}>
      <sphereGeometry args={[0.95, 64, 64]} />
      <meshStandardMaterial color="#B4581D" roughness={0.5} />
    </mesh>
    {Array.from({ length: 10 }).map((_, i) => (
      <mesh key={i} rotation={[0, (i / 10) * Math.PI * 2, 0]} scale={[1, 1.62, 1]}>
        <torusGeometry args={[0.94, 0.04, 8, 60, Math.PI]} />
        <meshStandardMaterial color="#6E3512" roughness={0.7} />
      </mesh>
    ))}
    <mesh position={[0, 1.72, 0]} rotation={[0, 0, -0.4]}>
      <cylinderGeometry args={[0.07, 0.1, 0.7, 12]} />
      <meshStandardMaterial color="#4A3218" roughness={0.9} />
    </mesh>
    {/* loose fermented beans at the base */}
    {[[-1.2, -1.7, 0.4], [1.15, -1.75, -0.3], [0.2, -1.8, 0.9]].map((p, i) => (
      <mesh key={i} position={p as [number, number, number]} scale={[0.26, 0.17, 0.2]} castShadow>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color="#4B2A15" roughness={0.75} />
      </mesh>
    ))}
  </group>
);

const Spinner = ({ children, autoRotate }: { children: React.ReactNode; autoRotate: boolean }) => {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.35;
  });
  return <group ref={ref}>{children}</group>;
};

const MODELS: Record<CategorySlug, () => JSX.Element> = {
  vanilla: VanillaModel,
  coffee: CoffeeModel,
  cocoa: CocoaModel,
};

/* ---------------- viewer ---------------- */

interface Props {
  category: CategorySlug;
  name: string;
  /** Optional custom backdrop image (overrides the default crop photography). */
  backdrop?: string;
}

export const Product3DViewer = ({ category, name, backdrop }: Props) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [failed, setFailed] = useState(false);
  const [supported, setSupported] = useState(true);
  const Model = MODELS[category] ?? CoffeeModel;
  const texture = normalizeImageSource(backdrop) || TEXTURES[category];

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setSupported(Boolean(c.getContext("webgl2") ?? c.getContext("webgl")));
    } catch {
      setSupported(false);
    }
  }, []);

  if (failed || !supported) {
    return (
      <div className="rounded-sm border border-border bg-muted/40 p-8 text-center">
        <AlertTriangle className="w-6 h-6 text-accent mx-auto mb-3" aria-hidden />
        <p className="text-sm text-foreground">
          The interactive 3D preview could not load on this device. All product photos and
          specifications remain available on the Photos tab.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-border overflow-hidden bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/40">
        <p className="btn-label text-xs text-primary">Interactive 3D — {name}</p>
        <button
          type="button"
          onClick={() => setAutoRotate((v) => !v)}
          className="btn-label text-[11px] inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border text-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden />
          {autoRotate ? "Pause spin" : "Auto spin"}
        </button>
      </div>

      <div className="h-[380px] md:h-[460px] bg-gradient-to-b from-muted/60 to-background">
        <Canvas
          shadows
          dpr={[1, 1.8]}
          camera={{ position: [0, 0.6, 5.2], fov: 42 }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", () => setFailed(true));
          }}
        >
          <Suspense
            fallback={
              <Html center>
                <span className="text-xs text-muted-foreground">Loading 3D model…</span>
              </Html>
            }
          >
            <ambientLight intensity={0.75} />
            <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />
            <directionalLight position={[-4, 2, -3]} intensity={0.5} />
            <PhotoBackdrop key={texture} src={texture} />
            <Spinner autoRotate={autoRotate}>
              <Model />
            </Spinner>
            <ContactShadows position={[0, -1.9, 0]} opacity={0.35} scale={9} blur={2.6} far={4} />
            <pointLight position={[0, -3, 2]} intensity={0.35} color="#ffd9a0" />
            <OrbitControls
              enablePan={false}
              minDistance={3}
              maxDistance={8}
              enableDamping
              onStart={() => setAutoRotate(false)}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-3 border-t border-border bg-muted/30 text-xs text-foreground/70">
        <span className="inline-flex items-center gap-1.5"><Move3d className="w-3.5 h-3.5 text-accent" aria-hidden /> Drag to rotate</span>
        <span className="inline-flex items-center gap-1.5"><ZoomIn className="w-3.5 h-3.5 text-accent" aria-hidden /> Scroll or pinch to zoom</span>
      </div>
    </div>
  );
};
