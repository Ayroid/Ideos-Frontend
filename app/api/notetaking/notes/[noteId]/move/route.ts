import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function PUT(
  req: NextRequest,
  { params }: { params: { noteId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { noteId } = params;

  if (!noteId) {
    return NextResponse.json({ error: "noteId is required" }, { status: 400 });
  }

  try {
    const { folderId } = await req.json();

    const response = await axios.put(
      `${process.env.SERVER_URL}/notetaking/notes/${noteId}/move`,
      { folderId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to move note:", error);
    return NextResponse.json({ error: "Failed to move note" }, { status: 500 });
  }
}
