import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the session to access token
    const session = getKindeServerSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: No session found" },
        { status: 401 },
      );
    }

    const accessToken = await session.getAccessTokenRaw();
    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized: No access token" },
        { status: 401 },
      );
    }

    const { title, description, theme } = await req.json();

    const response = await axios.post(
      `${process.env.SERVER_URL}/workspace`,  
      {
        title: title,
        description,
        theme,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("POST request failed:", error);

    // Handle Axios errors
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status || 500;
      const message = error.response.data?.error || "Request failed";
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 },
    );
  }
}
