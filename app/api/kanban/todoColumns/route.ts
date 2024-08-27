import axios from "axios";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { parseRequestBody } from "@/utils/requestparser";
import { NEXT_PUBLIC_API_URL } from "@/utils/constants";
const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const response = await axios.get(`${NEXT_PUBLIC_API_URL}/todoColumns`, {
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
    await axios.post(`${NEXT_PUBLIC_API_URL}/todoColumns`, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
