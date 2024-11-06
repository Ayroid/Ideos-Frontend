import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function POST(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();

  try {
    const folderData = await req.json(); // Get folder data from the request body

    const response = await axios.post(
      `${process.env.SERVER_URL}/folder`,
      folderData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to create folder:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}