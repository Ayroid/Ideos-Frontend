// app/api/kanban/boards/route.ts
import { parseRequestBody } from "@/utils/requestparser";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const response = await axios.get(
      `${process.env.SERVER_URL}/kanban/boards`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch boards:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to fetch boards",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    const response = await axios.post(
      `${process.env.SERVER_URL}/kanban/boards`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response?.status === 400) {
      // Handle board limit reached
      return NextResponse.json(
        {
          error: "Board limit reached",
          details: "You have reached the maximum limit of 5 boards"
        },
        { status: 400 }
      );
    }

    console.error("Failed to create board:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to create board",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    const { boards } = requestBody; // Expect array of boards with updated orders

    const response = await axios.put(
      `${process.env.SERVER_URL}/kanban/boards/reorder`,
      { boards },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to reorder boards:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to reorder boards",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}