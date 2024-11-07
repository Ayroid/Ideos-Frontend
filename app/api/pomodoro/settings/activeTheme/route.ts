import { parseRequestBody } from "@/utils/requestparser";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    const response = await axios.post(
      `${process.env.SERVER_URL}/pomodoro/settings/activeTheme`,
      {
        theme: requestBody.theme,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log(response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
