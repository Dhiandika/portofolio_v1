import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { APIRoute } from "astro";

import { html } from "satori-html";

// We need a font file for satori to work. We can import a font from locally or fetch from Google Fonts.
// It's usually safer and faster to fetch once and cache, or provide a local. 
// For this portfolio, Space Grotesk is used as the display font.

const fetchFont = async () => {
    const fontUrl = "https://fonts.gstatic.com/s/spacegrotesk/v15/V8mDoQDxIG3D6sKvuPbbV4vW7Qj1p_810931B2u3qT8Tj-22.woff"; // Space Grotesk Bold
    const fontRes = await fetch(fontUrl);
    return await fontRes.arrayBuffer();
};

let fontData: ArrayBuffer | null = null;

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);

    // Extract parameters, providing defaults
    const title = url.searchParams.get("title") || "Arham | Full Stack Brutalist";
    const desc = url.searchParams.get("desc") || "A Neo-Brutalist portfolio showcasing full-stack development skills.";
    const type = url.searchParams.get("type") || "PORTFOLIO";

    if (!fontData) {
        fontData = await fetchFont();
    }

    // Define neo-brutalist template using HTML string
    const markup = html`
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; width: 1200px; height: 630px; background-color: #f0e764; background-image: radial-gradient(#000000 1px, transparent 1px); background-size: 20px 20px; padding: 80px; font-family: 'Space Grotesk', sans-serif;">
      <div style="display: flex; flex-direction: column; background-color: white; border: 12px solid black; box-shadow: 20px 20px 0 0 #000; padding: 60px; width: 100%; height: 100%;">
        
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 40px;">
          <span style="background-color: #000; color: #1ff046; padding: 10px 20px; font-size: 24px; text-transform: uppercase; letter-spacing: 4px; font-weight: bold;">
            ${type}
          </span>
          <span style="font-size: 28px; font-weight: bold;">arham.exe</span>
        </div>

        <h1 style="font-size: 80px; font-weight: bold; line-height: 1.1; text-transform: uppercase; margin: 0; margin-bottom: 30px; color: #000; overflow-wrap: break-word;">
          ${title.length > 50 ? title.substring(0, 50) + "..." : title}
        </h1>

        <p style="font-size: 36px; color: #333; margin: 0; line-height: 1.4;">
          ${desc.length > 120 ? desc.substring(0, 120) + "..." : desc}
        </p>

        <div style="margin-top: auto; display: flex; width: 100%; height: 10px; background-color: #1ff046; border-top: 4px solid black; border-bottom: 4px solid black;"></div>
        
      </div>
    </div>
  `;

    const svg = await satori(markup as any, {
        width: 1200,
        height: 630,
        fonts: [
            {
                name: "Space Grotesk",
                data: fontData,
                weight: 700,
                style: "normal",
            },
        ],
    });

    const resvg = new Resvg(svg, {
        fitTo: {
            mode: "width",
            value: 1200,
        },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(new Uint8Array(pngBuffer), {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
};
