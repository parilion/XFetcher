import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    fetchInterval: 300,
    concurrency: 3,
    translationEnabled: true,
  });
}
