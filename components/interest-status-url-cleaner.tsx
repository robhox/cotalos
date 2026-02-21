"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface InterestStatusUrlCleanerProps {
  canonicalPath: string;
}

export function InterestStatusUrlCleaner({ canonicalPath }: InterestStatusUrlCleanerProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(canonicalPath, { scroll: false });
  }, [canonicalPath, router]);

  return null;
}
