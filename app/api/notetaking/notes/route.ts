import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();

  try {
    const response = await axios.get(
      `${process.env.SERVER_URL}/notetaking/notes`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.status === 200) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json({ error: "Notes not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();

  try {
    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    const response = await axios.post(
      `${process.env.SERVER_URL}/notetaking/notes`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log("Note response:", response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}