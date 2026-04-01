'use client';

// Minimal placeholder hook to avoid import errors. Not used by the new analyzer.
export function usePortfolio() {
  return {
  data: null as null,
  error: null as null,
  isLoading: false,
  portfolio: null as null,
  assets: [] as any[],
  accounts: [] as any[],
  addresses: [] as string[],
  marketData: null as null,
  refreshAssets: () => Promise.resolve(),
  refreshAccounts: () => Promise.resolve(),
  refreshAddresses: () => Promise.resolve(),
  refreshAll: () => Promise.resolve(),
  };
}
import useSWR, { mutate } from 'swr';
// This hook is deprecated - use new AI contract analyzer instead
export function usePortfolio() {
  return {
    data: null,
    error: null,
    isLoading: false,
    portfolio: null,
    assets: [],
    accounts: [],
    addresses: [],
    marketData: null,
    refreshAssets: () => {},
    refreshAccounts: () => {},
    refreshAddresses: () => {},
    refreshAll: () => {},
  };
}

}