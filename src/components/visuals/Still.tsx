import Image from "next/image";

/**
 * Static picture of the 3D model, captured from the same scene. Used while the 3D view loads,
 * when WebGL is not available, and as part of the reduced-motion layout. Decorative: the
 * surrounding text says what it shows.
 */
export function Still({ src, sizes, preload = false }: { src: string; sizes: string; preload?: boolean }) {
  return <Image src={src} alt="" fill sizes={sizes} preload={preload} fetchPriority={preload ? "high" : undefined} className="object-contain" />;
}

export const STILLS = {
  hero: "/stills/hero.png",
  howItWorks: "/stills/how-it-works.png",
  assembled: "/stills/assembled.png",
  exploded: "/stills/exploded.png",
} as const;
