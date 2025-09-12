import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user") || "user";

  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: "633px",
            width: "840px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage:
              "url(https://inscribe-coral.vercel.app/assets/images/meta.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "40%",
              width:"100%",
              textAlign: "center",
              color: "black",
              justifyContent:"center",
              paddingLeft:"30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontFamily: "Story Script", // apply once here
            }}
          >
            <p
              style={{
                fontSize: 20,
                margin: 0,
              }}
            >
              Signed by:
            </p>
            <p
              style={{
                fontSize: 25,
                margin: 0,
              }}
            >
              {user}
            </p>
          </div>
        </div>
      ),
      {
        width: 840,
        height: 633,
        fonts: [
          {
            name: "Story Script",
            data: await loadGoogleFont("Story Script", `Signed by:${user}`),
            style: "normal",
          },
        ],
      }
    );
  } catch (e: any) {
    console.error(`Error generating image: ${e.message}`);
    return new Response("Failed to generate the image", { status: 500 });
  }
}
