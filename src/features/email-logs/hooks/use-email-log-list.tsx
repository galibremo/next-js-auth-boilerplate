"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useMemo } from "react";

import { useProvidersQuery } from "@/features/email-providers/actions/email-provider.queries";
import { useEmailLogsQuery } from "@/features/email-logs/actions/email-log.queries";
import { emailLogSearchParams } from "@/features/email-logs/schemas/email-log.schema";
import type {
	EmailLog,
	EmailLogListQuery,
	EmailLogListResponse,
	EmailLogSort,
	EmailLogSortDirection,
	EmailLogStatus
} from "@/features/email-logs/types/email-log.types";
import { emailLogSortValues } from "@/features/email-logs/types/email-log.types";
import { useResourceListHandlers } from "@/hooks/use-resource-list-handlers";

type EmailLogPagination = PaginatedData<EmailLog>;

interface EmailLogListContextValue {
	tableData: EmailLog[];
	pagination: EmailLogPagination;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	providerId: string;
	toEmail: string;
	status: string;
	templateKey: string;
	fromDate: string;
	toDate: string;
	sort: EmailLogSort;
	dir: EmailLogSortDirection;
	providersQuery: ReturnType<typeof useProvidersQuery>;
	handleSorting: (sort: string, dir: EmailLogSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleToEmailChange: (value: string) => void;
	handleStatusFilter: (value?: EmailLogStatus) => void;
	handleDateRangeChange: (value: { fromDate?: string; toDate?: string }) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: EmailLogListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10
};

const sortableEmailLogColumns = new Set<string>(emailLogSortValues);
const EmailLogListContext = createContext<EmailLogListContextValue | null>(null);

export function EmailLogListProvider({ children }: GlobalLayoutProps) {
	const [params, setParams] = useQueryStates(emailLogSearchParams);
	const filters = useMemo<EmailLogListQuery>(
		() => ({
			page: params.page,
			pageSize: params.pageSize,
			providerId: params.providerId || undefined,
			toEmail: params.toEmail || undefined,
			status: params.status ? (params.status as EmailLogStatus) : undefined,
			templateKey: params.templateKey || undefined,
			fromDate: params.fromDate || undefined,
			toDate: params.toDate || undefined,
			sort: params.sort,
			dir: params.dir
		}),
		[
			params.dir,
			params.fromDate,
			params.page,
			params.pageSize,
			params.providerId,
			params.sort,
			params.status,
			params.templateKey,
			params.toDate,
			params.toEmail
		]
	);
	const emailLogsQuery = useEmailLogsQuery(filters);
	const providersQuery = useProvidersQuery({
		page: 1,
		pageSize: 500,
		sort: "name",
		dir: "asc"
	});
	const pagination = emailLogsQuery.data ?? defaultPagination;

	const {
		handleSorting,
		handleOptionFilter,
		handleDateRangeChange,
		handleResetAll,
		handleRefresh
	} = useResourceListHandlers({
		setParams: values => setParams(values as Parameters<typeof setParams>[0]),
		sortableColumns: sortableEmailLogColumns,
		defaultPageSize: defaultPagination.pageSize,
		refreshLabel: "email logs",
		refetch: () => emailLogsQuery.refetch(),
		resetExtras: {
			providerId: null,
			toEmail: null,
			status: null,
			templateKey: null,
			fromDate: null,
			toDate: null
		}
	});

	const handleToEmailChange = useCallback(
		(value: string) => {
			void setParams({ toEmail: value.trim() || null, page: 1 });
		},
		[setParams]
	);

	const handleStatusFilter = useCallback(
		(value?: EmailLogStatus) => {
			void setParams({ status: value || null, page: 1 });
		},
		[setParams]
	);

	const value = useMemo<EmailLogListContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination: {
				rows: pagination.rows,
				total: pagination.total,
				page: pagination.page,
				pageSize: pagination.pageSize
			},
			isLoading: emailLogsQuery.isLoading,
			isFetching: emailLogsQuery.isFetching,
			error: emailLogsQuery.error,
			providerId: params.providerId,
			toEmail: params.toEmail,
			status: params.status,
			templateKey: params.templateKey,
			fromDate: params.fromDate,
			toDate: params.toDate,
			sort: params.sort,
			dir: params.dir,
			providersQuery,
			handleSorting,
			handleOptionFilter,
			handleToEmailChange,
			handleStatusFilter,
			handleDateRangeChange,
			handleResetAll,
			handleRefresh
		}),
		[
			emailLogsQuery.error,
			emailLogsQuery.isFetching,
			emailLogsQuery.isLoading,
			handleDateRangeChange,
			handleOptionFilter,
			handleRefresh,
			handleResetAll,
			handleSorting,
			handleStatusFilter,
			handleToEmailChange,
			pagination.page,
			pagination.pageSize,
			pagination.rows,
			pagination.total,
			params.dir,
			params.fromDate,
			params.providerId,
			params.sort,
			params.status,
			params.templateKey,
			params.toDate,
			params.toEmail,
			providersQuery
		]
	);

	return <EmailLogListContext.Provider value={value}>{children}</EmailLogListContext.Provider>;
}

export function useEmailLogList() {
	const context = useContext(EmailLogListContext);

	if (!context) {
		throw new Error("useEmailLogList must be used within EmailLogListProvider");
	}

	return context;
}
