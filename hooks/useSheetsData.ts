"use client";

import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  const json = await res.json();
  return Array.isArray(json) ? json : [];
};

export function useSheetsData(sheetName: string) {
  const { data, error, isLoading, mutate } = useSWR(`/api/sheets/${sheetName}`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 0,
    dedupingInterval: 1000,
  });

  return {
    data: data ?? [],
    isLoading: !!isLoading,
    error: error ?? null,
    mutate,
  };
}

export default useSheetsData;