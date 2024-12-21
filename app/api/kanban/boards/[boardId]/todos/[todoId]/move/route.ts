import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";

const { getAccessTokenRaw } = getKindeServerSession();

export async function PUT(
  req: Request,
  { params }: { params: { boardId: string; id: string } },
) {
  try {
    const accessToken = await getAccessTokenRaw();
    const body = await req.json();

    const response = await axios.put(
      `${process.env.SERVER_URL}/kanban/boards/${params.boardId}/todos/${params.id}/move`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error moving todo:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to move todo",
        details: error.response?.data || "An unexpected error occurred",
      },
      { status: error.response?.status || 500 },
    );
  }
}
