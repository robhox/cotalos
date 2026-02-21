import { NextResponse } from "next/server";

import { searchCommercesAndCities } from "@/lib/data/commerces";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const rawLimit = Number(url.searchParams.get("limit") ?? "6");
  const limit = Number.isFinite(rawLimit) ? rawLimit : 6;

  const result = await searchCommercesAndCities(query, limit);
  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.error,
        entries: []
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ entries: result.data });
}
