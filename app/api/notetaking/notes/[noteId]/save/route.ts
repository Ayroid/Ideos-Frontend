import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function PUT(req: NextRequest, { params }: { params: { noteId: string } }) {
  const accessToken = await getAccessTokenRaw();
  const { noteId } = params;

  try {
    const { title, content, folderId } = await req.json(); // Make sure these fields are being sent correctly

    // Add validation to ensure required fields are present
    if (!title || !content || !noteId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Handle the request to update the note
    const response = await axios.put(
      `${process.env.SERVER_URL}/note/${noteId}`,
      { title, content, folderId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Return the updated note as the response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to update note:", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}
