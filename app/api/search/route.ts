import { NextResponse } from "next/server";

import { searchCommercesAndCities } from "@/lib/data/commerces";
import { getPostHogClient } from "@/lib/posthog-server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const rawLimit = Number(url.searchParams.get("limit") ?? "6");
  const limit = Number.isFinite(rawLimit) ? rawLimit : 6;

  const result = await searchCommercesAndCities(query, limit);
  if (!result.ok) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "server-search-api",
      event: "search_api_error",
      properties: {
        query,
        error: result.error,
      },
    });
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
