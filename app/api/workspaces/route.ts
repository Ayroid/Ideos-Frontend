import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function POST(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();

  try {
    const data = await req.json();

    const response = await axios.post(
      `${process.env.SERVER_URL}/workspace`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("POST request failed:", error);
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || "Failed to create workspace";
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();

  try {
    const response = await axios.get(`${process.env.SERVER_URL}/workspace`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("GET request failed:", error);
    const status = error.response?.status || 500;
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status },
    );
  }
}
