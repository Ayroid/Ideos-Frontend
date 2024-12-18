import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { notebookId: string; noteId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { notebookId, noteId } = params;

  console.log("notebookId:", notebookId);
  console.log("noteId:", noteId);

  if (!noteId || !notebookId) {
    return NextResponse.json(
      { error: "notebookId and noteId are required" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.delete(
      `${process.env.SERVER_URL}/notetaking/notebooks/${notebookId}/notes/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to delete note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { notebookId: string; noteId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { notebookId, noteId } = params;

  try {
    const body = await req.json();

    const response = await axios.put(
      `${process.env.SERVER_URL}/notetaking/notebooks/${notebookId}/notes/${noteId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to update note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 },
    );
  }
}
