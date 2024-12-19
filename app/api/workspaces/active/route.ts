import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();

  try {
    const response = await axios.get(
      `${process.env.SERVER_URL}/workspace/active`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("GET active workspace request failed:", error);
    const status = error.response?.status || 500;
    return NextResponse.json(
      { error: "Failed to fetch active workspace" },
      { status },
    );
  }
}

export async function PUT(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();

  try {
    const { workspaceId } = await req.json();

    const response = await axios.put(
      `${process.env.SERVER_URL}/workspace/active/${workspaceId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("PUT active workspace request failed:", error);
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || "Failed to set active workspace";
    return NextResponse.json({ error: message }, { status });
  }
}
