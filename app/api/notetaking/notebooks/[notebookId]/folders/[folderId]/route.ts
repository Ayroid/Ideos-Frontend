import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { notebookId: string; folderId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { notebookId, folderId } = params;

  console.log("notebookId:", notebookId);
  console.log("folderId:", folderId);

  if (!folderId || !notebookId) {
    return NextResponse.json(
      { error: "notebookId and folderId are required" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.delete(
      `${process.env.SERVER_URL}/notetaking/notebooks/${notebookId}/folders/${folderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to delete folder:", error);
    return NextResponse.json(
      { error: "Failed to delete folder" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { notebookId: string; folderId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { notebookId, folderId } = params;

  try {
    const body = await req.json();

    const response = await axios.put(
      `${process.env.SERVER_URL}/notetaking/notebooks/${notebookId}/folders/${folderId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to update folder:", error);
    return NextResponse.json(
      { error: "Failed to update folder" },
      { status: 500 },
    );
  }
}
