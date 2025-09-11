import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let user = searchParams.get("user");

  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: "240px",
            width: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundRepeat: "no-repeat",
            backgroundImage:
              "url(https://inscribe-coral.vercel.app/assets/images/meta.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {/* Main content */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: "20px",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              zIndex: 1,
              color: "black",
            }}
          >
            <p
              style={{
                fontSize: 15,
                color: "black",
                margin: 0,
                marginTop: 0,
              }}
            >
              Signed by:
            </p>
            <p
              style={{
                fontSize: 15,
                color: "black",
                margin: 0,
              }}
            >
              {user || "user"}!
            </p>
          </div>
        </div>
      ),
      {
        width: 500,
        height: 240,
      }
    );
  } catch (e: any) {
    console.log(`Error generating image: ${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
