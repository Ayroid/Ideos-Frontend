import axios from "axios";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { parseRequestBody } from "@/utils/requestparser";
const { getAccessTokenRaw } = getKindeServerSession();

export async function PUT(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const url = new URL(req.url);
    const columnId = url.pathname.split("/").pop();
    const requestBody = await parseRequestBody(req);
    await axios.put(
      `${process.env.SERVER_URL}/todoColumns/${columnId}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const url = new URL(req.url);
    const columnId = url.pathname.split("/").pop();
    await axios.delete(`${process.env.SERVER_URL}/todoColumns/${columnId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
