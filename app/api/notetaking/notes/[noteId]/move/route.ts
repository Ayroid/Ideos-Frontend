// app/api/notetaking/notes/[noteId]/route.ts

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function PUT(req: NextRequest, { params }: { params: { noteId: string } }) {
  const accessToken = await getAccessTokenRaw();
  const { noteId } = params;

  try {
    const { folderId } = await req.json(); // Expecting { folderId: targetFolderId }

    // Send the request to update the note's folderId
    const response = await axios.put(
      `${process.env.SERVER_URL}/note/${noteId}`,
      { folderId },  // The new folderId to move the note
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to move note:", error);
    return NextResponse.json({ error: "Failed to move note" }, { status: 500 });
  }
}
