"use client";

import { useMemo, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { normalizeSearchValue, resolveSearchTarget } from "@/lib/mock-data";
import type { SearchIndexEntry } from "@/lib/types";

interface SearchBoxProps {
  index: SearchIndexEntry[];
}

export function SearchBox({ index }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const normalizedQuery = useMemo(() => normalizeSearchValue(query), [query]);

  const suggestions = useMemo(() => {
    if (!normalizedQuery) {
      return index.slice(0, 6);
    }

    return index
      .filter((entry) => normalizeSearchValue(entry.label).includes(normalizedQuery))
      .slice(0, 6);
  }, [index, normalizedQuery]);

  const navigateTo = (entry: SearchIndexEntry): void => {
    setErrorMessage(null);
    setQuery(entry.label);
    startTransition(() => {
      router.push(entry.targetPath);
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const target = resolveSearchTarget(query, index);
    if (!target) {
      setErrorMessage("Aucun resultat. Essayez une autre ville ou un autre commerce.");
      return;
    }
    navigateTo(target);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-primary)]/15 bg-[linear-gradient(140deg,rgba(255,255,255,0.95),rgba(255,252,249,0.82))] p-3 shadow-[0_18px_48px_rgba(107,27,40,0.08)] sm:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_20%,rgba(194,168,120,0.25),transparent_38%),radial-gradient(circle_at_95%_100%,rgba(107,27,40,0.14),transparent_46%)]" />
      <div className="relative space-y-3">
        <form
          onSubmit={onSubmit}
          className="relative grid gap-2 md:grid-cols-[1fr_auto]"
        >
          <label htmlFor="homepage-search" className="sr-only">
            Rechercher par ville, code postal ou boucherie
          </label>
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" />
              </svg>
            </span>
            <input
              id="homepage-search"
              type="search"
              value={query}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(event) => {
                setQuery(event.target.value);
                if (errorMessage) {
                  setErrorMessage(null);
                }
              }}
              placeholder="Ville, code postal ou boucherie"
              className="h-12 w-full rounded-xl border border-black/15 bg-white/92 pl-11 pr-4 text-[15px] outline-none transition-all placeholder:text-black/50 focus:border-[color:var(--color-primary)]/70 focus:bg-white focus:ring-2 focus:ring-[color:var(--color-primary)]/20"
              autoComplete="off"
              data-track="search_input"
            />
          </div>
          <button
            type="submit"
            className="h-12 rounded-xl bg-[color:var(--color-primary)] px-6 text-sm font-semibold tracking-[0.01em] text-[#F7F3F1] shadow-[0_10px_24px_rgba(107,27,40,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[color:var(--color-primary)]/92 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isPending}
            data-track="search_submit"
          >
            {isPending ? "Recherche..." : "Rechercher"}
          </button>
        </form>

        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-primary)]/70">
            {normalizedQuery ? "Suggestions" : "Recherches rapides"}
          </p>
          <p className="text-xs text-black/50">{index.length} entrees</p>
        </div>

        {suggestions.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {suggestions.map((suggestion) => (
              <li key={`${suggestion.type}-${suggestion.targetPath}`}>
                <button
                  type="button"
                  onClick={() => navigateTo(suggestion)}
                  className="group flex w-full items-center justify-between rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-left transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-primary)]/35 hover:bg-white"
                  data-track="search_suggestion_click"
                >
                  <span className="truncate pr-3 text-[13px] font-medium text-[color:var(--color-primary)]">
                    {suggestion.label}
                  </span>
                  <span className="shrink-0 rounded-full border border-[color:var(--color-primary)]/25 px-2 py-0.5 text-[10px] uppercase tracking-[0.13em] text-[color:var(--color-primary)]/75 transition-colors group-hover:bg-[color:var(--color-primary)] group-hover:text-[color:var(--color-bg)]">
                    {suggestion.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : normalizedQuery ? (
          <p className="rounded-xl border border-dashed border-black/20 bg-white/70 px-4 py-3 text-sm text-black/60">
            Aucun resultat pour cette recherche.
          </p>
        ) : null}

        {errorMessage ? (
          <p className="rounded-xl border border-[color:var(--color-primary)]/20 bg-[color:var(--color-primary)]/8 px-4 py-3 text-sm text-[color:var(--color-primary)]">
            {errorMessage}
          </p>
        ) : null}
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-2xl border transition-opacity duration-200 ${
          isFocused ? "opacity-100 border-[color:var(--color-accent)]/45" : "opacity-0 border-transparent"
        }`}
      />
    </div>
  );
}
