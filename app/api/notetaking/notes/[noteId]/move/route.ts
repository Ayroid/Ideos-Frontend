import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function PUT(req: NextRequest, { params }: { params: { noteId: string } }) {
  const accessToken = await getAccessTokenRaw();
  const { noteId } = params;

  try {
    // Get the new folderId from the request body
    const { folderId } = await req.json(); // Expecting { folderId: targetFolderId }

    // Send the request to the backend to move the note
    const response = await axios.put(
      `${process.env.SERVER_URL}/note/move/${noteId}`,  // Use the correct route for moving the note
      { folderId },  // Send the new folderId
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,  // Pass the authorization token
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to move note:", error);
    return NextResponse.json({ error: "Failed to move note" }, { status: 500 });
  }
}
