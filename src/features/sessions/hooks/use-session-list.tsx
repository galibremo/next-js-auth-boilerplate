"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useMemo } from "react";

import { useSessionsQuery } from "@/features/sessions/actions/sessions.queries";
import { sessionSearchParams } from "@/features/sessions/schemas/sessions.schema";
import type {
	Session,
	SessionListQuery,
	SessionListResponse,
	SessionSort,
	SessionSortDirection
} from "@/features/sessions/types/sessions.types";
import { sessionSortValues } from "@/features/sessions/types/sessions.types";
import { useResourceListHandlers } from "@/hooks/use-resource-list-handlers";

type SessionPagination = PaginatedData<Session>;

interface SessionListContextValue {
	tableData: Session[];
	pagination: SessionPagination;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	activeOtherSessionCount: number;
	search: string;
	status: string;
	deviceType: string;
	fromDate: string;
	toDate: string;
	sort: SessionSort;
	dir: SessionSortDirection;
	handleSorting: (sort: string, dir: SessionSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleSearchChange: (value: string) => void;
	handleDateChange: (key: "fromDate" | "toDate", value: string) => void;
	handleDateRangeChange: (value: { fromDate?: string; toDate?: string }) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: SessionListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10,
	activeOtherSessionCount: 0
};
const sortableSessionColumns = new Set<string>(sessionSortValues);
const SessionListContext = createContext<SessionListContextValue | null>(null);

interface SessionListProviderProps extends GlobalLayoutProps {}

export function SessionListProvider({ children }: SessionListProviderProps) {
	const [params, setParams] = useQueryStates(sessionSearchParams);
	const filters = useMemo<SessionListQuery>(
		() => ({
			page: params.page,
			pageSize: params.pageSize,
			search: params.search || undefined,
			status: params.status || undefined,
			deviceType: params.deviceType || undefined,
			fromDate: params.fromDate || undefined,
			toDate: params.toDate || undefined,
			sort: params.sort,
			dir: params.dir
		}),
		[
			params.deviceType,
			params.dir,
			params.fromDate,
			params.page,
			params.pageSize,
			params.search,
			params.sort,
			params.status,
			params.toDate
		]
	);
	const sessionsQuery = useSessionsQuery(filters);
	const pagination = sessionsQuery.data ?? defaultPagination;

	const {
		handleSorting,
		handleOptionFilter,
		handleSearchChange,
		handleDateRangeChange,
		handleResetAll,
		handleRefresh
	} = useResourceListHandlers({
		setParams,
		sortableColumns: sortableSessionColumns,
		defaultPageSize: defaultPagination.pageSize,
		defaultSort: "createdAt",
		defaultDir: "desc",
		refreshLabel: "sessions",
		refetch: sessionsQuery.refetch,
		resetExtras: { status: null, deviceType: null, fromDate: null, toDate: null }
	});

	const handleDateChange = useCallback(
		(key: "fromDate" | "toDate", value: string) => {
			void setParams({ [key]: value.trim() || null, page: 1 });
		},
		[setParams]
	);

	const value = useMemo<SessionListContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination: {
				rows: pagination.rows,
				total: pagination.total,
				page: pagination.page,
				pageSize: pagination.pageSize
			},
			isLoading: sessionsQuery.isLoading,
			isFetching: sessionsQuery.isFetching,
			error: sessionsQuery.error,
			activeOtherSessionCount: pagination.activeOtherSessionCount ?? 0,
			search: params.search,
			status: params.status,
			deviceType: params.deviceType,
			fromDate: params.fromDate,
			toDate: params.toDate,
			sort: params.sort,
			dir: params.dir,
			handleSorting,
			handleOptionFilter,
			handleSearchChange,
			handleDateChange,
			handleDateRangeChange,
			handleResetAll,
			handleRefresh
		}),
		[
			handleDateChange,
			handleDateRangeChange,
			handleOptionFilter,
			handleRefresh,
			handleResetAll,
			handleSearchChange,
			handleSorting,
			pagination.activeOtherSessionCount,
			pagination.page,
			pagination.pageSize,
			pagination.rows,
			pagination.total,
			params.deviceType,
			params.dir,
			params.fromDate,
			params.search,
			params.sort,
			params.status,
			params.toDate,
			sessionsQuery.error,
			sessionsQuery.isFetching,
			sessionsQuery.isLoading
		]
	);

	return <SessionListContext.Provider value={value}>{children}</SessionListContext.Provider>;
}

export function useSessionList() {
	const context = useContext(SessionListContext);

	if (!context) {
		throw new Error("useSessionList must be used within SessionListProvider");
	}

	return context;
}
