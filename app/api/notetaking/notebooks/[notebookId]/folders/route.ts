import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(
  req: NextRequest,
  { params }: { params: { notebookId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { notebookId } = params;
  console.log("Notebook ID:", notebookId);

  try {
    const response = await axios.get(
      `${process.env.SERVER_URL}/notetaking/notebooks/${notebookId}/folders`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.status === 200) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json({ error: "Folders not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to fetch folders:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { notebookId: string } },
) {
  const accessToken = await getAccessTokenRaw();
  const { notebookId } = params;
  console.log("Notebook ID:", notebookId);

  try {
    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    const response = await axios.post(
      `${process.env.SERVER_URL}/notetaking/notebooks/${notebookId}/folders`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log("Folder response:", response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to create folder:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}