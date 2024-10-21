import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const accessToken = await getAccessTokenRaw();
    const workspaceId = searchParams.get("workspaceId");
    const userId = searchParams.get("userId");
  
    if (!workspaceId || !userId) {
      return NextResponse.json({ error: "WorkspaceId or UserId not specified" }, { status: 400 });
    }
  
    try {
      console.log("GET request");
      const [privateWorkspaces, ] = await Promise.all([
        axios.get(`${process.env.SERVER_URL}/workspace/private/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        // axios.get(`${process.env.SERVER_URL}/workspace/collaborating/${userId}`, {
        //   headers: { Authorization: `Bearer ${accessToken}` },
        // }),
        // axios.get(`${process.env.SERVER_URL}/workspace/shared/${userId}`, {
        //   headers: { Authorization: `Bearer ${accessToken}` },
        // }),
        // axios.get(`${process.env.SERVER_URL}/workspace/${workspaceId}/folders`, {
        //   headers: { Authorization: `Bearer ${accessToken}` },
        // }),
      ]);
  
      return NextResponse.json({
        privateWorkspaces: privateWorkspaces.data,
        // collaboratingWorkspaces: collaboratingWorkspaces.data,
        // sharedWorkspaces: sharedWorkspaces.data,
        // workspaceFolders: workspaceFolders.data,
      });
    } catch (error) {
      console.error("GET request failed:", error);
      return NextResponse.json({ error: "Request failed" }, { status: 500 });
    }
  }
  