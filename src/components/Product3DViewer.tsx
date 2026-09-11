import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { BackSide, TextureLoader, type Texture } from "three";
import type { CategorySlug } from "@/data/products";
import { cropHero, normalizeImageSource } from "@/data/cropImages";
import { cn } from "@/lib/utils";

const TEXTURES: Record<CategorySlug, string> = {
  vanilla: cropHero.vanilla,
  coffee: cropHero.coffee,
  cocoa: cropHero.cocoa,
};

const PhotoSphere = ({ src }: { src: string }) => {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    let active = true;
    const loader = new TextureLoader();
    loader.load(
      src,
      (loaded) => active && setTexture(loaded),
      undefined,
      () => active && setTexture(null),
    );

    return () => {
      active = false;
    };
  }, [src]);

  if (!texture) return null;

  return (
    <mesh>
      <sphereGeometry args={[8, 64, 40]} />
      <meshBasicMaterial map={texture} side={BackSide} toneMapped={false} />
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
  const [autoRotate, setAutoRotate] = useState(true);
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
      <div className="rounded-2xl border border-border bg-muted/40 p-8 text-center shadow-sm">
        <p className="text-sm text-foreground">
          The interactive image preview could not load on this device. All product photos and
          specifications remain available on the Photos tab.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("w-full rounded-2xl border border-border overflow-hidden bg-card shadow-sm", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/40">
        <p className="btn-label text-xs text-primary">Interactive image, {name}</p>
        <button
          type="button"
          onClick={() => setAutoRotate((value) => !value)}
          className="btn-label text-[11px] inline-flex items-center px-3 py-1.5 rounded-full border border-border text-foreground hover:border-primary hover:text-primary transition-colors"
        >
          {autoRotate ? "Pause view" : "Auto view"}
        </button>
      </div>

      <div className="h-[72svh] min-h-[430px] max-h-[780px] bg-muted/40">
        <Canvas
          dpr={[1, 1.8]}
          camera={{ position: [0, 0, 0.15], fov: 68 }}
          onCreated={({ gl }) => {
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
            <PhotoSphere key={texture} src={texture} />
            <OrbitControls
              autoRotate={autoRotate}
              autoRotateSpeed={0.35}
              enableDamping
              enablePan={false}
              enableZoom
              minDistance={0.1}
              maxDistance={0.5}
              rotateSpeed={0.45}
              zoomSpeed={0.45}
              onStart={() => setAutoRotate(false)}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-3 border-t border-border bg-muted/30 text-xs text-foreground/70">
        <span>Drag to look around</span>
        <span>Scroll or pinch to zoom</span>
      </div>
    </div>
  );
};
