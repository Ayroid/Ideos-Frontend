// app/api/kanban/boards/[boardId]/todos/[todoId]/route.ts
import { parseRequestBody } from "@/utils/requestparser";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(
  req: NextRequest,
  { params }: { params: { boardId: string; todoId: string } }
) {
  const accessToken = await getAccessTokenRaw();
  try {
    const response = await axios.get(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/todos/${params.todoId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch todo:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to fetch todo",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { boardId: string; todoId: string } }
) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    const response = await axios.put(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/todos/${params.todoId}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to update todo:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to update todo",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { boardId: string; todoId: string } }
) {
  const accessToken = await getAccessTokenRaw();
  try {
    const response = await axios.delete(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/todos/${params.todoId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to delete todo:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to delete todo",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}