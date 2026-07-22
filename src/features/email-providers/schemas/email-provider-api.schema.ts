import { z } from "zod";

import {
	emailProviderSortDirectionValues,
	emailProviderSortValues,
	type EmailProviderListQuery
} from "@/features/email-providers/types/email-provider.types";
import { validateEnum, validateNumber, validateString } from "@/validators/common-rule";

function firstSearchParamValue(value: unknown): unknown {
	return Array.isArray(value) ? value[0] : value;
}

const optionalTrimmedStringSchema = z.preprocess(value => {
	const nextValue = firstSearchParamValue(value);
	if (typeof nextValue !== "string") return undefined;

	const trimmed = nextValue.trim();
	return trimmed || undefined;
}, validateString("Value").optional().catch(undefined));

const dateQuerySchema = z.preprocess(
	value => optionalTrimmedStringSchema.parse(value),
	validateString("Date", { regex: /^\d{4}-\d{2}-\d{2}$/ }).optional().catch(undefined)
);

const pageQuerySchema = z
	.preprocess(firstSearchParamValue, validateNumber("Page", { min: 1, int: true }))
	.optional()
	.catch(1)
	.default(1);

const pageSizeQuerySchema = z
	.preprocess(firstSearchParamValue, validateNumber("Page Size", { min: 1, int: true }).max(100))
	.optional()
	.catch(10)
	.default(10);

const sortQuerySchema = z
	.preprocess(firstSearchParamValue, validateEnum("Sort", emailProviderSortValues))
	.optional()
	.catch("createdAt")
	.default("createdAt");

const directionQuerySchema = z
	.preprocess(firstSearchParamValue, validateEnum("Direction", emailProviderSortDirectionValues))
	.optional()
	.catch("desc")
	.default("desc");

export const emailProviderListQuerySchema = z
	.object({
		page: pageQuerySchema,
		pageSize: pageSizeQuerySchema,
		search: optionalTrimmedStringSchema,
		providerType: optionalTrimmedStringSchema,
		isActive: optionalTrimmedStringSchema,
		fromDate: dateQuerySchema,
		toDate: dateQuerySchema,
		sort: sortQuerySchema,
		dir: directionQuerySchema
	})
	.refine(data => !data.fromDate || !data.toDate || data.fromDate <= data.toDate, {
		message: "fromDate must be less than or equal to toDate"
	});

export function createEmailProviderListQuery(input: unknown): EmailProviderListQuery {
	const query = emailProviderListQuerySchema.parse(input);

	return {
		page: query.page,
		pageSize: query.pageSize,
		search: query.search,
		providerType: query.providerType,
		isActive: query.isActive,
		fromDate: query.fromDate,
		toDate: query.toDate,
		sort: query.sort,
		dir: query.dir
	};
}
