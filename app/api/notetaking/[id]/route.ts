import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();

  try {
    const url = new URL(req.url);
    const workspaceId = url.pathname.split("/").pop();  // Extract workspaceId from the URL

    if (!workspaceId) {
      return NextResponse.json({ error: "WorkspaceId not specified" }, { status: 400 });
    }

    const [privateWorkspaces, collaboratingWorkspaces] = await Promise.all([
      axios.get(`${process.env.SERVER_URL}/workspace/private/${workspaceId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      axios.get(`${process.env.SERVER_URL}/workspace/collaborating/${workspaceId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      // axios.get(`${process.env.SERVER_URL}/workspace/shared/${workspaceId}`, {
      //   headers: { Authorization: `Bearer ${accessToken}` },
      // }),
      // axios.get(`${process.env.SERVER_URL}/workspace/${workspaceId}/folders`, {
      //   headers: { Authorization: `Bearer ${accessToken}` },
      // }),
    ]);
    

    // Return all the data in the response
    return NextResponse.json({
      privateWorkspaces: privateWorkspaces.data,
      collaboratingWorkspaces: collaboratingWorkspaces.data,
      // sharedWorkspaces: sharedWorkspaces.data,
      // workspaceFolders: workspaceFolders.data,
    });
  } catch (error) {
    console.error("GET request failed:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
