import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(
  req: NextRequest,
  { params }: { params: { notebookId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { notebookId } = params;

  try {
    const response = await axios.get(
      `${process.env.SERVER_URL}/notetaking/notebooks/${notebookId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("GET request failed:", error);
    const status = error.response?.status || 500;
    return NextResponse.json({ error: "Failed to fetch notebook" }, { status });
  }
}
