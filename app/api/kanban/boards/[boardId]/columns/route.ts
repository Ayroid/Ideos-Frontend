// app/api/kanban/boards/[boardId]/columns/route.ts
import { parseRequestBody } from "@/utils/requestparser";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  const accessToken = await getAccessTokenRaw();
  try {
    const response = await axios.get(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/columns`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to fetch columns:", error);
    return NextResponse.json(
      { error: "Failed to fetch columns" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    const response = await axios.post(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/columns`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to create column:", error);
    return NextResponse.json(
      { error: "Failed to create column" },
      { status: 500 }
    );
  }
}

// app/api/kanban/boards/[boardId]/columns/[id]/route.ts
export async function PUT(
  req: NextRequest,
  { params }: { params: { boardId: string; id: string } }
) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    const response = await axios.put(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/columns/${params.id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to update column:", error);
    return NextResponse.json(
      { error: "Failed to update column" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { boardId: string; id: string } }
) {
  const accessToken = await getAccessTokenRaw();
  try {
    const response = await axios.delete(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/columns/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to delete column:", error);
    return NextResponse.json(
      { error: "Failed to delete column" },
      { status: 500 }
    );
  }
}