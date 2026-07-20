"use client";

import { useCallback } from "react";
import { toast } from "sonner";

type SetParams = (
  values: Record<string, unknown>,
) => Promise<unknown> | unknown;

type UseResourceListHandlersOptions = {
  setParams: SetParams;
  sortableColumns: Set<string>;
  defaultPageSize?: number;
  defaultSort?: string;
  defaultDir?: string;
  refreshLabel: string;
  refetch: () => Promise<unknown>;
  /** Extra fields cleared on reset (status/dates/etc.). */
  resetExtras?: Record<string, null | string | number>;
};

/**
 * Shared nuqs + toast refresh handlers for resource tables.
 * Features keep their own query + context; this concentrates list filter locality.
 */
export function useResourceListHandlers({
  setParams,
  sortableColumns,
  defaultPageSize = 10,
  defaultSort = "createdAt",
  defaultDir = "desc",
  refreshLabel,
  refetch,
  resetExtras = {},
}: UseResourceListHandlersOptions) {
  const handleSorting = useCallback(
    (nextSort: string, nextDir: string) => {
      if (!sortableColumns.has(nextSort)) return;
      void setParams({ sort: nextSort, dir: nextDir, page: 1 });
    },
    [setParams, sortableColumns],
  );

  const handleOptionFilter = useCallback(
    (key: string, value?: string | string[] | null) => {
      const normalizedValue = Array.isArray(value) ? value.join(",") : value;

      if (key === "page") {
        void setParams({ page: Number(normalizedValue) || 1 });
        return;
      }

      if (key === "limit" || key === "pageSize") {
        void setParams({
          pageSize: Number(normalizedValue) || defaultPageSize,
          page: 1,
        });
        return;
      }
    },
    [defaultPageSize, setParams],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      void setParams({ search: value.trim() || null, page: 1 });
    },
    [setParams],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      void setParams({ status: value || null, page: 1 });
    },
    [setParams],
  );

  const handleDateRangeChange = useCallback(
    (value: { fromDate?: string; toDate?: string }) => {
      void setParams({
        fromDate: value.fromDate?.trim() || null,
        toDate: value.toDate?.trim() || null,
        page: 1,
      });
    },
    [setParams],
  );

  const handleResetAll = useCallback(() => {
    void setParams({
      page: 1,
      pageSize: defaultPageSize,
      search: null,
      sort: defaultSort,
      dir: defaultDir,
      ...resetExtras,
    });
  }, [defaultDir, defaultPageSize, defaultSort, resetExtras, setParams]);

  const handleRefresh = useCallback(() => {
    void toast.promise(refetch(), {
      loading: `Refreshing ${refreshLabel}...`,
      success: `${refreshLabel} refreshed`,
      error: `Failed to refresh ${refreshLabel}`,
    });
  }, [refetch, refreshLabel]);

  return {
    handleSorting,
    handleOptionFilter,
    handleSearchChange,
    handleStatusChange,
    handleDateRangeChange,
    handleResetAll,
    handleRefresh,
  };
}
