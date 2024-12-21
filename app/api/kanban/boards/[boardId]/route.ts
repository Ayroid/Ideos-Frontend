// app/api/kanban/boards/[boardId]/route.ts
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
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch board:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to fetch board",
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
    const response = await axios.put(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to update board:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to update board",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  const accessToken = await getAccessTokenRaw();
  try {
    const response = await axios.delete(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response?.status === 400) {
      // Handle attempt to delete the only board
      return NextResponse.json(
        {
          error: "Cannot delete board",
          details: "Cannot delete the only board"
        },
        { status: 400 }
      );
    }

    console.error("Failed to delete board:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to delete board",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Set default board endpoint
export async function PATCH(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  const accessToken = await getAccessTokenRaw();
  try {
    const response = await axios.put(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/default`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to set default board:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to set default board",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}