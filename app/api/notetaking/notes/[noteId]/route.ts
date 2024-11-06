// app/api/notetaking/notes/[noteId]/route.ts

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function DELETE(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();

  const { pathname } = new URL(req.url);
  const noteId = pathname.split("/").pop();
  console.log("noteId:", noteId);

  if (!noteId) {
    return NextResponse.json({ error: "noteId is required" }, { status: 400 });
  }

  try {
    const response = await axios.delete(
      `${process.env.SERVER_URL}/note/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to delete note:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { noteId: string } }) {
  const accessToken = await getAccessTokenRaw();
  const { noteId } = params;

  try {
    const { newTitle } = await req.json();

    const response = await axios.put(
      `${process.env.SERVER_URL}/note/${noteId}`,
      { title: newTitle },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to rename note:", error);
    return NextResponse.json({ error: "Failed to rename note" }, { status: 500 });
  }
}