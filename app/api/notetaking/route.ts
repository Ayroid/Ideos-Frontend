import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

// Handler for creating a new workspace (POST request)
export async function POST(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const requestBody = await req.json(); // Parse request body
    const response = await axios.post(
      `${process.env.SERVER_URL}/workspace`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Workspace Created Response hai yehhh:", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("POST request failed:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

// Handler for fetching an existing workspace by ID (GET request)
export async function GET(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  
  // Extract workspaceId from the request URL
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `${process.env.SERVER_URL}/workspace/${workspaceId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("GET request failed:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
