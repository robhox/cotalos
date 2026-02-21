<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into cotalos.be, a Belgian butcher shop directory built with Next.js 16.1.6 (App Router). The integration covers both client-side and server-side tracking, error capture, and a reverse proxy to route PostHog ingestion through the app's own domain.

## Summary of changes

| File | What was done |
|---|---|
| `instrumentation-client.ts` | **New file.** Initializes PostHog client-side using the Next.js 15.3+ recommended approach (`instrumentation-client.ts`). Enables automatic exception capture and debug mode in development. Routes ingestion through `/ingest` reverse proxy. |
| `next.config.ts` | Added `rewrites()` to proxy PostHog requests through `/ingest/*` to `eu.i.posthog.com`, avoiding ad-blockers. Added `skipTrailingSlashRedirect: true` as required by PostHog. |
| `lib/posthog-server.ts` | **New file.** Singleton server-side PostHog Node client (`posthog-node`) for capturing events from Server Actions and API routes. |
| `components/search/search-box.tsx` | Added `search_submitted`, `search_suggestion_clicked`, and `search_no_results` events in their respective event handlers. |
| `app/boucherie/[slug]/page.tsx` | Added `commerce_page_viewed` server-side event (top of interest funnel). Added `interest_submitted` and `interest_submission_failed` events inside the `submitInterest` server action. |
| `app/api/search/route.ts` | Added `search_api_error` server-side event when the search API returns a 503 (database unavailable). |
| `.env.local` | Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables. |

## Events tracked

| Event name | Description | File |
|---|---|---|
| `commerce_page_viewed` | User viewed a commerce detail page — top of the interest conversion funnel | `app/boucherie/[slug]/page.tsx` |
| `interest_submitted` | User successfully registered their interest in online ordering at a butcher shop (server action) | `app/boucherie/[slug]/page.tsx` |
| `interest_submission_failed` | Interest form submission failed due to a database error (server action) | `app/boucherie/[slug]/page.tsx` |
| `search_submitted` | User submitted a search query and a matching result was found | `components/search/search-box.tsx` |
| `search_suggestion_clicked` | User clicked on a search suggestion from the autocomplete dropdown | `components/search/search-box.tsx` |
| `search_no_results` | A search returned no matching results for the user's query | `components/search/search-box.tsx` |
| `search_api_error` | The search API returned an error (database unavailable, 503) | `app/api/search/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Dashboard — Analytics basics**: https://eu.posthog.com/project/129881/dashboard/535094
- 🔁 **Interest registration funnel** (Commerce page → Interest submitted): https://eu.posthog.com/project/129881/insights/Ig4xfsTp
- 📈 **Commerce pages viewed & interests submitted (trend)**: https://eu.posthog.com/project/129881/insights/LtWnEVLX
- 🔍 **Search performance: submitted vs. no results**: https://eu.posthog.com/project/129881/insights/bkRoXVAS
- ⚠️ **Interest submission failures (errors)**: https://eu.posthog.com/project/129881/insights/khmTUXnU
- 🏪 **Search engagement (suggestions & submissions)**: https://eu.posthog.com/project/129881/insights/jUP7pCAp

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
