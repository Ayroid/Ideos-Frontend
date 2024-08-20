import { NextRequest } from "next/server";

async function parseRequestBody(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await req.json();
    return body;
  }

  return null;
}

export { parseRequestBody };
