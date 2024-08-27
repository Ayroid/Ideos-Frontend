import axios from "axios";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { parseRequestBody } from "@/utils/requestparser";
import { NEXT_PUBLIC_API_URL } from "@/utils/constants";
const { getAccessTokenRaw } = getKindeServerSession();

export async function PUT(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const url = new URL(req.url);
    const todoId = url.pathname.split("/").pop();
    const requestBody = await parseRequestBody(req);
    await axios.put(`${NEXT_PUBLIC_API_URL}/todos/${todoId}`, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const url = new URL(req.url);
    const todoId = url.pathname.split("/").pop();
    console.log(todoId);
    await axios.delete(`${NEXT_PUBLIC_API_URL}/todos/${todoId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
