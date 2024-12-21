// app/api/kanban/route.ts
import { parseRequestBody } from "@/utils/requestparser";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    // Get the default board and its data
    const response = await axios.get(
      `${process.env.SERVER_URL}/kanban/default`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch default Kanban data:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to fetch Kanban data",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Initialize Kanban setup if needed (create default board)
export async function POST(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    const response = await axios.post(
      `${process.env.SERVER_URL}/kanban/initialize`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to initialize Kanban:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to initialize Kanban",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Update global Kanban settings
export async function PUT(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    const response = await axios.put(
      `${process.env.SERVER_URL}/kanban/settings`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to update Kanban settings:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to update Kanban settings",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Search across all Kanban boards and todos
export async function PATCH(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await parseRequestBody(req);
    const { query, filters } = requestBody;

    const response = await axios.post(
      `${process.env.SERVER_URL}/kanban/search`,
      { query, filters },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to search Kanban:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to search Kanban",
        details: error.response?.data || "An unexpected error occurred"
      },
      { status: error.response?.status || 500 }
    );
  }
}