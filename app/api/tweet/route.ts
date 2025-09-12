// app/api/tweet/route.ts
import { cookies } from "next/headers";
import { TwitterApi } from "twitter-api-v2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookie = await cookies();
    const { text, imageBase64 } = await req.json();

    if (!text || text.length > 280) {
      return NextResponse.json({ error: "Invalid tweet text" }, { status: 400 });
    }

    const accessToken = cookie.get("accessToken")?.value;
    const accessSecret = cookie.get("accessSecret")?.value;

    if (!accessToken || !accessSecret) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = new TwitterApi({
      appKey: "EXsoJxOFMXt9Q4MqUDuv1rhE9",
      appSecret: "N4QOM2nMOqhGieNgvMeFE0btBfnX8caUOqXSLIW6SiGOXEeqEE",
      accessToken,
      accessSecret,
    });

    let mediaId: string | undefined;

    if (imageBase64) {
      console.log("Uploading image to Twitter...");
      try {
        // Upload media to Twitter
        const media = await client.v1.uploadMedia(Buffer.from(imageBase64, "base64"), {
          mimeType: "image/png", // adjust based on your image type
        });
        mediaId = media;
        console.log("Image uploaded successfully, media ID:", mediaId);
      } catch (mediaError) {
        console.error("Media upload error:", mediaError);
        // Continue without image if upload fails
      }
    }

    // Post tweet with optional media
    const tweet = await client.v2.tweet({
      text,
      media: mediaId ? { media_ids: [mediaId] } : undefined,
    });
    
    return NextResponse.json({
      success: true,
      tweet: {
        id: tweet.data.id,
        text: tweet.data.text,
      },
    });
  } catch (error: any) {
    console.error("Tweet error:", error);
    return NextResponse.json(
      { error: "Failed to tweet", details: error },
      { status: 500 }
    );
  }
}
