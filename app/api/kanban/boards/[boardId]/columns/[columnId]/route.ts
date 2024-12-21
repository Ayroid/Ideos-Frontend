// app/api/kanban/boards/[boardId]/columns/[columnId]/route.ts
import { parseRequestBody } from "@/utils/requestparser";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function PUT(
  req: NextRequest,
  { params }: { params: { boardId: string; columnId: string } }
) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    const response = await axios.put(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/columns/${params.columnId}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to update column:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to update column",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { boardId: string; columnId: string } }
) {
  const accessToken = await getAccessTokenRaw();
  try {
    const response = await axios.delete(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/columns/${params.columnId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to delete column:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to delete column",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}