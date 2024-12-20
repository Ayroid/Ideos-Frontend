import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { folderId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { folderId } = params;

  if (!folderId) {
    return NextResponse.json(
      { error: "folderId is required" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.delete(
      `${process.env.SERVER_URL}/notetaking/folders/${folderId}`,
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
  { params }: { params: { folderId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { folderId } = params;

  try {
    const body = await req.json();

    const response = await axios.put(
      `${process.env.SERVER_URL}/notetaking/folders/${folderId}`,
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

export async function GET(
  req: NextRequest,
  { params }: { params: { folderId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { folderId } = params;

  if (!folderId) {
    return NextResponse.json(
      { error: "folderId is required" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get(
      `${process.env.SERVER_URL}/notetaking/folders/${folderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to get folder:", error);
    return NextResponse.json(
      { error: "Failed to get folder" },
      { status: 500 },
    );
  }
}