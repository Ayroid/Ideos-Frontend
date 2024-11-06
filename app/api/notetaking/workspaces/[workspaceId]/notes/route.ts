import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { workspaceId: string } },
) {
  const { getAccessTokenRaw } = await getKindeServerSession();
  const accessToken = await getAccessTokenRaw();
  const { workspaceId } = params;
  console.log("Workspace ID:", workspaceId);

  try {
    const response = await axios.get(
      `${process.env.SERVER_URL}/note/workspace/${workspaceId}`,
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
