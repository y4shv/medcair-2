import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "medcAIr: your health records in one place";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Lockup (the SVG file as given) on a solid ink background. No photos.
export default async function TwitterImage() {
  const svg = await readFile(path.join(process.cwd(), "public/brand/logo-lockup-on-dark.svg"), "utf8");
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F2A3D",
        }}
      >
        <img src={src} alt="medcAIr" width={882} height={240} />
      </div>
    ),
    size,
  );
}
