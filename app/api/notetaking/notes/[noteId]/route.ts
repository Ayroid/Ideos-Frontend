import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { noteId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { noteId } = params;

  if (!noteId) {
    return NextResponse.json(
      { error: "noteId is required" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.delete(
      `${process.env.SERVER_URL}/notetaking/notes/${noteId}`,
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
  { params }: { params: { noteId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { noteId } = params;

  try {
    const body = await req.json();

    const response = await axios.put(
      `${process.env.SERVER_URL}/notetaking/notes/${noteId}`,
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

export async function GET(
  req: NextRequest,
  { params }: { params: { noteId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { noteId } = params;

  if (!noteId) {
    return NextResponse.json(
      { error: "noteId is required" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get(
      `${process.env.SERVER_URL}/notetaking/notes/${noteId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to get note:", error);
    return NextResponse.json(
      { error: "Failed to get note" },
      { status: 500 },
    );
  }
}