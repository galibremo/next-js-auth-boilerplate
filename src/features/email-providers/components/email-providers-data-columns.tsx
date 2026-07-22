"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { EmailProvider } from "@/features/email-providers/types/email-provider.types";
import {
	formatEmailProviderDate,
	getProviderTypeBadgeVariant,
	getProviderTypeLabel
} from "@/features/email-providers/utils/email-provider-format";


import { EmailProviderDataTableRowActions } from "./email-provider-data-table-row-actions";



const testStatusLabels: Record<string, string> = {
	success: "Success",
	failed: "Failed",
	pending: "Pending"
};

interface EmailProviderColumnsOptions {
	sort: string;
	dir: "asc" | "desc";
	handleSorting: (sort: string, dir: "asc" | "desc") => void;
	onEdit: (provider: EmailProvider) => void;
}

export function createEmailProviderColumns({
	sort,
	dir,
	handleSorting,
	onEdit
}: EmailProviderColumnsOptions): ColumnDef<EmailProvider>[] {
	return [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Name"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<div className="min-w-0">
					<div className="truncate font-medium">{row.original.name}</div>
					<div className="text-muted-foreground truncate text-xs">
						{row.original.config.senderEmail as string}
					</div>
				</div>
			)
		},
		{
			accessorKey: "providerType",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Type"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<Badge variant={getProviderTypeBadgeVariant(row.original.providerType)}>
					{getProviderTypeLabel(row.original.providerType)}
				</Badge>
			)
		},
		{
			accessorKey: "isDefault",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Default"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (row.original.isDefault ? "Yes" : "No")
		},
		{
			accessorKey: "isActive",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Active"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (row.original.isActive ? "Yes" : "No")
		},
		{
			accessorKey: "lastTestStatus",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Last Test"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => {
				const status = row.original.lastTestStatus;
				if (!status) {
					return <span className="text-muted-foreground text-sm">Not tested</span>;
				}

				const variant =
					status === "success"
						? "default"
						: status === "failed"
							? "destructive"
							: "secondary";

				return (
					<div className="flex items-center gap-2">
						<Badge variant={variant}>{testStatusLabels[status] ?? status}</Badge>
						<span className="text-muted-foreground text-xs">
							{formatEmailProviderDate(row.original.lastTestedAt!)}
						</span>
					</div>
				);
			}
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Created"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => formatEmailProviderDate(row.original.createdAt)
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => <EmailProviderDataTableRowActions provider={row.original} onEdit={onEdit} />
		}
	];
}
