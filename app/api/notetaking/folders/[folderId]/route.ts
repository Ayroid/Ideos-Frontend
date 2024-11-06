// app/api/notetaking/folders/[folderId]/route.ts

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function DELETE(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();

  // Extract folderId from the URL
  const { pathname, searchParams } = new URL(req.url);
  const folderId = pathname.split("/").pop();

  // Extract workspaceId from the query parameters
  const workspaceId = searchParams.get("workspaceId");

  if (!folderId || !workspaceId) {
    return NextResponse.json(
      { error: "folderId and workspaceId are required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.delete(
      `${process.env.SERVER_URL}/folder/${workspaceId}/${folderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to delete folder:", error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}
