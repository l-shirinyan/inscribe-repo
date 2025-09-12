// app/api/auth/twitter/callback/route.ts

import { cookies } from "next/headers";
import { TwitterApi } from "twitter-api-v2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cookie = await cookies();
  const oauth_token = searchParams.get("oauth_token");
  const oauth_verifier = searchParams.get("oauth_verifier");

  const oauth_token_secret = cookie.get("oauth_token_secret")?.value;

  console.log("Callback received:", { oauth_token, oauth_verifier, oauth_token_secret });
  console.log("All cookies:", cookie.getAll().map(c => ({ name: c.name, value: c.value?.substring(0, 10) + "..." })));

  if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
    console.log("Missing required parameters");
    return NextResponse.json(
      { error: "Invalid auth callback", details: { oauth_token: !!oauth_token, oauth_verifier: !!oauth_verifier, oauth_token_secret: !!oauth_token_secret } },
      { status: 400 }
    );
  }

  const client = new TwitterApi({
    appKey: "EXsoJxOFMXt9Q4MqUDuv1rhE9",
    appSecret: "N4QOM2nMOqhGieNgvMeFE0btBfnX8caUOqXSLIW6SiGOXEeqEE",
    accessToken: oauth_token,
    accessSecret: oauth_token_secret,
  });

  try {
    console.log("Attempting to login with oauth_verifier:", oauth_verifier);
    const { accessToken, accessSecret } = await client.login(oauth_verifier);
    console.log("Successfully got access tokens");

    // Save accessToken + accessSecret in a secure store (DB or session)
    // For demo: set in cookies (again, not secure!)
    const baseUrl = process.env.NODE_ENV === "production" 
      ? "https://inscribe-coral.vercel.app" 
      : "http://localhost:3000";
    const response = NextResponse.redirect(`${baseUrl}/leaderboard`); // redirect back to leaderboard
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    response.cookies.set("accessSecret", accessSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    console.error("Error type:", typeof error);
    console.error("Error keys:", Object.keys(error || {}));
    
    return NextResponse.json({
      error: "Failed to get access tokens",
      details: {
        message: error?.message || "Unknown error",
        code: error?.code || "NO_CODE",
        data: error?.data || null,
        stack: error?.stack || "No stack trace",
        fullError: JSON.stringify(error, null, 2)
      },
    });
  }
}
