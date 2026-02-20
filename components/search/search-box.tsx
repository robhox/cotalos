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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const suggestions = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query);
    if (!normalizedQuery) {
      return index.slice(0, 7);
    }

    return index
      .filter((entry) => normalizeSearchValue(entry.label).includes(normalizedQuery))
      .slice(0, 7);
  }, [index, query]);

  const navigateTo = (entry: SearchIndexEntry): void => {
    setErrorMessage(null);
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
    <div className="space-y-3">
      <form onSubmit={onSubmit} className="relative flex flex-col gap-3 md:flex-row">
        <label htmlFor="homepage-search" className="sr-only">
          Rechercher par ville, code postal ou boucherie
        </label>
        <input
          id="homepage-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (errorMessage) {
              setErrorMessage(null);
            }
          }}
          placeholder="Ville, code postal ou boucherie"
          className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-[15px] outline-none transition-all placeholder:text-black/45 focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary)]/25"
          list="search-suggestions"
          autoComplete="off"
          data-track="search_input"
        />
        <button
          type="submit"
          className="h-12 rounded-xl bg-[color:var(--color-primary)] px-6 text-sm font-semibold text-[#F7F3F1] transition-all hover:bg-[color:var(--color-primary)]/92 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
          data-track="search_submit"
        >
          {isPending ? "Recherche..." : "Rechercher"}
        </button>
      </form>

      <datalist id="search-suggestions">
        {suggestions.map((suggestion) => (
          <option key={`${suggestion.type}-${suggestion.targetPath}`} value={suggestion.label} />
        ))}
      </datalist>

      <div className="flex flex-wrap items-center gap-2 text-xs text-black/65">
        <span className="font-medium uppercase tracking-wide">Suggestions</span>
        {suggestions.slice(0, 4).map((suggestion) => (
          <button
            key={`${suggestion.type}-${suggestion.targetPath}`}
            type="button"
            onClick={() => navigateTo(suggestion)}
            className="rounded-full border border-black/12 bg-white px-3 py-1.5 hover:border-[color:var(--color-primary)]/45 hover:text-[color:var(--color-primary)]"
            data-track="search_suggestion_click"
          >
            {suggestion.label}
          </button>
        ))}
      </div>

      {errorMessage ? <p className="text-sm text-[color:var(--color-primary)]">{errorMessage}</p> : null}
    </div>
  );
}
