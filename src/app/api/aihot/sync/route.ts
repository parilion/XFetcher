import { NextRequest, NextResponse } from "next/server";
import { syncLatestAihotItems } from "@/modules/aihot/sync";

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.AIHOT_SYNC_SECRET;
  const requestSecret = request.headers.get("x-sync-secret");

  if (!configuredSecret || requestSecret !== configuredSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await syncLatestAihotItems();

  return NextResponse.json(result);
}
