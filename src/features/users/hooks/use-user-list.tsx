"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useMemo } from "react";

import { useUsersQuery } from "@/features/users/actions/users.queries";
import { useResourceListHandlers } from "@/hooks/use-resource-list-handlers";

import type {
  ManagedUser,
  UserListQuery,
  UserListResponse,
  UserSort,
  UserSortDirection,
} from "@/features/users/types/users.types";
import { userSortValues } from "@/features/users/types/users.types";

type UserPagination = PaginatedData<ManagedUser>;

interface UserListContextValue {
  tableData: ManagedUser[];
  pagination: UserPagination;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  search: string;
  role: string;
  emailVerified: string;
  fromDate: string;
  toDate: string;
  sort: UserSort;
  dir: UserSortDirection;
  handleSorting: (sort: string, dir: UserSortDirection) => void;
  handleOptionFilter: (key: string, value?: string | string[] | null) => void;
  handleSearchChange: (value: string) => void;
  handleEmailVerifiedChange: (value: string) => void;
  handleDateRangeChange: (value: {
    fromDate?: string;
    toDate?: string;
  }) => void;
  handleResetAll: () => void;
  handleRefresh: () => void;
}

const defaultPagination: UserListResponse = {
  rows: [],
  total: 0,
  page: 1,
  pageSize: 10,
};

const sortableUserColumns = new Set<string>(userSortValues);
const UserListContext = createContext<UserListContextValue | null>(null);

interface UserListProviderProps extends GlobalLayoutProps {}

export function UserListProvider({ children }: UserListProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      search: searchParams.get("search") || "",
      role: searchParams.get("role") || "",
      emailVerified: searchParams.get("emailVerified") || "",
      fromDate: searchParams.get("fromDate") || "",
      toDate: searchParams.get("toDate") || "",
      sort: (searchParams.get("sort") as UserSort) || "createdAt",
      dir: (searchParams.get("dir") as UserSortDirection) || "desc",
    };
  }, [searchParams]);

  const setParams = useCallback(
    (updates: Record<string, unknown>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      }
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );
  const filters = useMemo<UserListQuery>(
    () => ({
      page: params.page,
      pageSize: params.pageSize,
      search: params.search || undefined,
      role: params.role || undefined,
      emailVerified: params.emailVerified || undefined,
      fromDate: params.fromDate || undefined,
      toDate: params.toDate || undefined,
      sort: params.sort,
      dir: params.dir,
    }),
    [
      params.dir,
      params.emailVerified,
      params.fromDate,
      params.page,
      params.pageSize,
      params.role,
      params.search,
      params.sort,
      params.toDate,
    ],
  );
  const usersQuery = useUsersQuery(filters);
  const pagination = usersQuery.data ?? defaultPagination;

  const {
    handleSorting,
    handleOptionFilter,
    handleSearchChange,
    handleDateRangeChange,
    handleResetAll,
    handleRefresh,
  } = useResourceListHandlers({
    setParams,
    sortableColumns: sortableUserColumns,
    defaultPageSize: defaultPagination.pageSize,
    defaultSort: "createdAt",
    defaultDir: "desc",
    refreshLabel: "users",
    refetch: usersQuery.refetch,
    resetExtras: {
      role: null,
      emailVerified: null,
      fromDate: null,
      toDate: null,
    },
  });

  const handleEmailVerifiedChange = useCallback(
    (value: string) => {
      void setParams({ emailVerified: value || null, page: 1 });
    },
    [setParams],
  );

  const value = useMemo<UserListContextValue>(
    () => ({
      tableData: pagination.rows,
      pagination: {
        rows: pagination.rows,
        total: pagination.total,
        page: pagination.page,
        pageSize: pagination.pageSize,
      },
      isLoading: usersQuery.isLoading,
      isFetching: usersQuery.isFetching,
      error: usersQuery.error,
      search: params.search,
      role: params.role,
      emailVerified: params.emailVerified,
      fromDate: params.fromDate,
      toDate: params.toDate,
      sort: params.sort,
      dir: params.dir,
      handleSorting,
      handleOptionFilter,
      handleSearchChange,
      handleEmailVerifiedChange,
      handleDateRangeChange,
      handleResetAll,
      handleRefresh,
    }),
    [
      handleDateRangeChange,
      handleEmailVerifiedChange,
      handleOptionFilter,
      handleRefresh,
      handleResetAll,
      handleSearchChange,
      handleSorting,
      pagination.page,
      pagination.pageSize,
      pagination.rows,
      pagination.total,
      params.dir,
      params.emailVerified,
      params.fromDate,
      params.role,
      params.search,
      params.sort,
      params.toDate,
      usersQuery.error,
      usersQuery.isFetching,
      usersQuery.isLoading,
    ],
  );

  return (
    <UserListContext.Provider value={value}>
      {children}
    </UserListContext.Provider>
  );
}

export function useUserList() {
  const context = useContext(UserListContext);

  if (!context) {
    throw new Error("useUserList must be used within UserListProvider");
  }

  return context;
}
