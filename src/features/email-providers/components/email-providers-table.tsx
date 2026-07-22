"use client";

import { useCallback, useMemo, useState } from "react";

import { DataTable } from "@/components/common/table/data-table";

import { useEmailProviderList } from "@/features/email-providers/hooks/use-email-provider-list";
import type { EmailProvider } from "@/features/email-providers/types/email-provider.types";

import { createEmailProviderColumns } from "./email-providers-data-columns";
import { EmailProvidersDataTableToolbar } from "./email-providers-data-table-toolbar";
import { EmailProviderFormSheet } from "./email-provider-form-sheet";

export function EmailProvidersTable() {
	const {
		tableData,
		pagination,
		isLoading,
		handleOptionFilter,
		sort,
		dir,
		handleSorting
	} = useEmailProviderList();
	const [editingProvider, setEditingProvider] = useState<EmailProvider | null>(null);

	const handleEdit = useCallback((provider: EmailProvider) => {
		setEditingProvider(provider);
	}, []);

	const columns = useMemo(
		() =>
			createEmailProviderColumns({
				sort: sort as string,
				dir: dir,
				handleSorting: handleSorting,
				onEdit: handleEdit
			}),
		[sort, dir, handleSorting, handleEdit]
	);

	return (
		<>
			<DataTable
				columns={columns}
				isLoading={isLoading}
				data={tableData}
				pagination={pagination}
				handleOptionFilter={handleOptionFilter}
				DataTableToolbar={EmailProvidersDataTableToolbar}
				emptyTitle="No email providers found"
				emptyDescription="Add your first email provider to start sending application emails."
			/>

			{editingProvider && (
				<EmailProviderFormSheet
					open={!!editingProvider}
					onOpenChange={open => {
						if (!open) setEditingProvider(null);
					}}
					provider={editingProvider}
				/>
			)}
		</>
	);
}
