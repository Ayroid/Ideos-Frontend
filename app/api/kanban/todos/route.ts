import { parseRequestBody } from "@/utils/requestparser";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const response = await axios.get(`${process.env.SERVER_URL}/kanban/todos`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    await axios.post(`${process.env.SERVER_URL}/kanban/todos`, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}