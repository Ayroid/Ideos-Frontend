import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(req: NextRequest) {
    const accessToken = await getAccessTokenRaw();
    
    try {
      const response = await axios.get(
        `${process.env.SERVER_URL}/workspace/get/user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        return NextResponse.json(response.data);
      } else {
        return NextResponse.json({ error: " User Workspace not found" }, { status: 404 });
      }
    } catch (error) {
      console.error("GET request failed:", error);
      return NextResponse.json({ error: "Request failed" }, { status: 500 });
    }
  }
  