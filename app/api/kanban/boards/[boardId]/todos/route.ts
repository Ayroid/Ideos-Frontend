// app/api/kanban/boards/[boardId]/todos/route.ts
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
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/todos`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch todos:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to fetch todos",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
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
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/todos`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to create todo:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to create todo",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    const { todos } = requestBody; // Expect array of todos with updated orders

    const response = await axios.put(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/todos/reorder`,
      { todos },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to reorder todos:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to reorder todos",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}