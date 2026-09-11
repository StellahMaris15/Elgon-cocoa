import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import {
  ClampToEdgeWrapping,
  LinearFilter,
  Mesh,
  SRGBColorSpace,
  TextureLoader,
  type Texture,
} from "three";
import type { CategorySlug } from "@/data/products";
import { cropHero, normalizeImageSource } from "@/data/cropImages";
import { cn } from "@/lib/utils";

const TEXTURES: Record<CategorySlug, string> = {
  vanilla: cropHero.vanilla,
  coffee: cropHero.coffee,
  cocoa: cropHero.cocoa,
};

const LABELS: Record<CategorySlug, string> = {
  vanilla: "Vanilla Harvest Photography",
  coffee: "Coffee Harvest Photography",
  cocoa: "Cocoa Harvest Photography",
};

const PhotoCard = ({ src, autoMotion }: { src: string; autoMotion: boolean }) => {
  const groupRef = useRef<Mesh>(null);
  const { gl, viewport } = useThree();
  const [texture, setTexture] = useState<Texture | null>(null);
  const [imageSize, setImageSize] = useState<[number, number] | null>(null);

  useEffect(() => {
    let active = true;
    const loader = new TextureLoader();

    loader.load(
      src,
      (loaded) => {
        if (!active) return;
        const image = loaded.image as { width?: number; height?: number; naturalWidth?: number; naturalHeight?: number };
        loaded.colorSpace = SRGBColorSpace;
        loaded.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
        loaded.generateMipmaps = true;
        loaded.minFilter = LinearFilter;
        loaded.magFilter = LinearFilter;
        loaded.wrapS = ClampToEdgeWrapping;
        loaded.wrapT = ClampToEdgeWrapping;
        setImageSize([
          image.naturalWidth || image.width || 16,
          image.naturalHeight || image.height || 9,
        ]);
        setTexture(loaded);
      },
      undefined,
      () => active && setTexture(null),
    );

    return () => {
      active = false;
      setTexture((current) => {
        current?.dispose();
        return null;
      });
    };
  }, [gl, src]);

  useFrame(({ clock }) => {
    if (!groupRef.current || !autoMotion) return;
    const t = clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.55) * 0.14;
    groupRef.current.rotation.x = Math.sin(t * 0.38) * 0.045;
    groupRef.current.rotation.z = Math.sin(t * 0.24) * 0.012;
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.035;
  });

  if (!texture) return null;

  const imageAspect = imageSize ? imageSize[0] / imageSize[1] : 16 / 9;
  const width = viewport.width * 0.985;
  const height = viewport.height * 0.94;
  const planeAspect = width / height;

  texture.repeat.set(1, 1);
  texture.offset.set(0, 0);

  if (imageAspect > planeAspect) {
    const visibleWidth = planeAspect / imageAspect;
    texture.repeat.set(visibleWidth, 1);
    texture.offset.set((1 - visibleWidth) / 2, 0);
  } else {
    const visibleHeight = imageAspect / planeAspect;
    texture.repeat.set(1, visibleHeight);
    texture.offset.set(0, (1 - visibleHeight) / 2);
  }

  const backdropWidth = viewport.width * 1.02;
  const backdropHeight = viewport.height * 0.985;

  return (
    <mesh ref={groupRef}>
      <mesh position={[0.12, -0.1, -0.12]}>
        <planeGeometry args={[backdropWidth, backdropHeight]} />
        <meshBasicMaterial color="#e9ece7" transparent opacity={0.68} />
      </mesh>
      <mesh position={[0.08, -0.08, -0.08]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#102318" transparent opacity={0.16} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height, 48, 24]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </mesh>
  );
};

interface Props {
  category: CategorySlug;
  name: string;
  /** Optional custom backdrop image (overrides the default crop photography). */
  backdrop?: string;
  className?: string;
}

export const Product3DViewer = ({ category, name, backdrop, className }: Props) => {
  const [autoMotion, setAutoMotion] = useState(true);
  const [failed, setFailed] = useState(false);
  const [supported, setSupported] = useState(true);
  const texture = normalizeImageSource(backdrop) || TEXTURES[category];

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setSupported(Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl")));
    } catch {
      setSupported(false);
    }
  }, []);

  if (failed || !supported) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm text-foreground">The interactive image preview could not load on this device.</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:px-5">
        <div>
          <p className="btn-label text-xs text-primary">{name.split(",")[0]}</p>
          <p className="text-xs text-muted-foreground">{LABELS[category]}</p>
        </div>
        <button
          type="button"
          onClick={() => setAutoMotion((value) => !value)}
          className="btn-label inline-flex items-center rounded-full border border-border px-3 py-1.5 text-[11px] capitalize text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {autoMotion ? "Pause 3D" : "Play 3D"}
        </button>
      </div>

      <div className="h-[clamp(430px,68svh,760px)] bg-[radial-gradient(circle_at_50%_18%,hsl(var(--card))_0%,hsl(var(--background))_58%,hsl(var(--muted))_100%)]">
        <Canvas
          dpr={[1.5, 2]}
          camera={{ position: [0, 0, 4.8], fov: 36 }}
          onCreated={({ gl }) => {
            gl.setClearColor("#f5f6f8", 1);
            gl.domElement.addEventListener("webglcontextlost", () => setFailed(true));
          }}
        >
          <Suspense
            fallback={
              <Html center>
                <span className="text-xs text-muted-foreground">Loading image...</span>
              </Html>
            }
          >
            <PhotoCard key={texture} src={texture} autoMotion={autoMotion} />
            <OrbitControls
              enableDamping
              enablePan={false}
              enableZoom
              minDistance={3.8}
              maxDistance={6.2}
              minPolarAngle={Math.PI / 2.65}
              maxPolarAngle={Math.PI / 1.6}
              minAzimuthAngle={-Math.PI / 6}
              maxAzimuthAngle={Math.PI / 6}
              rotateSpeed={0.32}
              zoomSpeed={0.45}
              onStart={() => setAutoMotion(false)}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border bg-muted/30 px-4 py-3 text-xs text-foreground/70 md:px-5">
        <span>Drag gently to tilt</span>
        <span>Scroll or pinch to zoom</span>
      </div>
    </div>
  );
};
