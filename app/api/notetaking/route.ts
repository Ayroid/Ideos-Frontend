import { parseRequestBody } from "@/utils/requestparser";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function POST(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    const response = await axios.post(`${process.env.SERVER_URL}/workspace`, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("POST request failed:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

