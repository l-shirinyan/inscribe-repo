// app/api/auth/twitter/login/route.ts

import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function GET() {
  const client = new TwitterApi({
    appKey: "EXsoJxOFMXt9Q4MqUDuv1rhE9",
    appSecret: "N4QOM2nMOqhGieNgvMeFE0btBfnX8caUOqXSLIW6SiGOXEeqEE",
  });

  const baseUrl = process.env.NODE_ENV === "production" 
    ? "https://theuniversalprinciplesofliberty.com" 
    : "http://localhost:3000";

  const { url, oauth_token_secret } =
    await client.generateAuthLink(
      `${baseUrl}/api/auth/twitter/callback`,
      { linkMode: "authorize" }
    );

  // Save oauth_token_secret in your DB or cookie/session (must be available in callback)
  // For simplicity, let's assume you use cookies (not secure for production!)
  const response = NextResponse.redirect(url); // Redirect to Twitter authorization
  response.cookies.set("oauth_token_secret", oauth_token_secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  return response;
}
