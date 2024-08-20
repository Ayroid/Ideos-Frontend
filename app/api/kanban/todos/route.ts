import axios from "axios";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
const { getAccessTokenRaw } = getKindeServerSession();

export async function GET(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const response = await axios.get(`${process.env.SERVER_URL}/todos`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    await axios.post(`${process.env.SERVER_URL}/todos`, req.body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const url = new URL(req.url);
    const todoId = url.pathname.split("/").pop();
    await axios.put(`${process.env.SERVER_URL}/todos/${todoId}`, req.body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const accessToken = await getAccessTokenRaw();
  try {
    const url = new URL(req.url);
    const todoId = url.pathname.split("/").pop();
    await axios.delete(`${process.env.SERVER_URL}/todos/${todoId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
