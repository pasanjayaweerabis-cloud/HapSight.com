import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand, hero, meta } from "@/content/site";

export const alt = meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 1200×630 social preview, rendered at build time from the captured 3D still. */
export default async function OpenGraphImage() {
  const still = await readFile(join(process.cwd(), "public/stills/hero.png"));
  const src = `data:image/png;base64,${still.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(160deg, #232523 0%, #1b1d1c 45%, #0d3a2e 100%)",
          color: "#f3f6f4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 72px", width: 560 }}>
          <div style={{ fontSize: 26, letterSpacing: 4, color: "#7fd9bd", textTransform: "uppercase" }}>{brand.name}</div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, marginTop: 20, letterSpacing: -2 }}>{hero.headline}</div>
          <div style={{ fontSize: 30, color: "#c3cfc9", marginTop: 24, lineHeight: 1.3 }}>{hero.sub}</div>
        </div>
        <img src={src} width={640} height={640} alt="" style={{ marginTop: -5 }} />
      </div>
    ),
    size,
  );
}
