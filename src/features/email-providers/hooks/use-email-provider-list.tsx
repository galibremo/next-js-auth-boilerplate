"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useMemo } from "react";

import { useProvidersQuery } from "@/features/email-providers/actions/email-provider.queries";
import { emailProviderSearchParams } from "@/features/email-providers/schemas/email-provider.schema";
import type {
	EmailProvider,
	EmailProviderListQuery,
	EmailProviderListResponse,
	EmailProviderSort,
	EmailProviderSortDirection
} from "@/features/email-providers/types/email-provider.types";
import { emailProviderSortValues } from "@/features/email-providers/types/email-provider.types";
import { useResourceListHandlers } from "@/hooks/use-resource-list-handlers";

type EmailProviderPagination = PaginatedData<EmailProvider>;

interface EmailProviderListContextValue {
	tableData: EmailProvider[];
	pagination: EmailProviderPagination;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	search: string;
	providerType: string;
	isActive: string;
	fromDate: string;
	toDate: string;
	sort: EmailProviderSort;
	dir: EmailProviderSortDirection;
	handleSorting: (sort: string, dir: EmailProviderSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleSearchChange: (value: string) => void;
	handleDateChange: (key: "fromDate" | "toDate", value: string) => void;
	handleDateRangeChange: (value: { fromDate?: string; toDate?: string }) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: EmailProviderListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10
};
const sortableEmailProviderColumns = new Set<string>(emailProviderSortValues);
const EmailProviderListContext = createContext<EmailProviderListContextValue | null>(null);

interface EmailProviderListProviderProps extends GlobalLayoutProps {}

export function EmailProviderListProvider({ children }: EmailProviderListProviderProps) {
	const [params, setParams] = useQueryStates(emailProviderSearchParams);
	const filters = useMemo<EmailProviderListQuery>(
		() => ({
			page: params.page,
			pageSize: params.pageSize,
			search: params.search || undefined,
			providerType: params.providerType || undefined,
			isActive: params.isActive || undefined,
			fromDate: params.fromDate || undefined,
			toDate: params.toDate || undefined,
			sort: params.sort,
			dir: params.dir
		}),
		[
			params.dir,
			params.fromDate,
			params.isActive,
			params.page,
			params.pageSize,
			params.providerType,
			params.search,
			params.sort,
			params.toDate
		]
	);
	const providersQuery = useProvidersQuery(filters);
	const pagination = providersQuery.data ?? defaultPagination;

	const {
		handleSorting,
		handleOptionFilter,
		handleSearchChange,
		handleDateRangeChange,
		handleResetAll,
		handleRefresh
	} = useResourceListHandlers({
		setParams: values => setParams(values as Parameters<typeof setParams>[0]),
		sortableColumns: sortableEmailProviderColumns,
		defaultPageSize: defaultPagination.pageSize,
		refreshLabel: "providers",
		refetch: () => providersQuery.refetch(),
		resetExtras: { providerType: null, isActive: null, fromDate: null, toDate: null }
	});

	const handleDateChange = useCallback(
		(key: "fromDate" | "toDate", value: string) => {
			void setParams({ [key]: value.trim() || null, page: 1 });
		},
		[setParams]
	);

	const value = useMemo<EmailProviderListContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination: {
				rows: pagination.rows,
				total: pagination.total,
				page: pagination.page,
				pageSize: pagination.pageSize
			},
			isLoading: providersQuery.isLoading,
			isFetching: providersQuery.isFetching,
			error: providersQuery.error,
			search: params.search,
			providerType: params.providerType,
			isActive: params.isActive,
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
			pagination.page,
			pagination.pageSize,
			pagination.rows,
			pagination.total,
			params.dir,
			params.fromDate,
			params.isActive,
			params.providerType,
			params.search,
			params.sort,
			params.toDate,
			providersQuery.error,
			providersQuery.isFetching,
			providersQuery.isLoading
		]
	);

	return <EmailProviderListContext.Provider value={value}>{children}</EmailProviderListContext.Provider>;
}

export function useEmailProviderList() {
	const context = useContext(EmailProviderListContext);

	if (!context) {
		throw new Error("useEmailProviderList must be used within EmailProviderListProvider");
	}

	return context;
}
