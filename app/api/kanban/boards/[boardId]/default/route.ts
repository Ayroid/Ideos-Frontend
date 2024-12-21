import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
const { getAccessTokenRaw } = getKindeServerSession();

export async function PUT(
  req: NextRequest,
  { params }: { params: { boardId: string } },
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
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      "Failed to set default board:",
      error.response?.data || error.message,
    );
    return NextResponse.json(
      {
        error: "Failed to set default board",
        details: error.response?.data || "An unexpected error occurred",
      },
      { status: error.response?.status || 500 },
    );
  }
}
