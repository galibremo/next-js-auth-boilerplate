import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import {
	emailProviderSortDirectionValues,
	emailProviderSortValues
} from "@/features/email-providers/types/email-provider.types";

export const emailProviderSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(""),
	providerType: parseAsString.withDefault(""),
	isActive: parseAsString.withDefault(""),
	fromDate: parseAsString.withDefault(""),
	toDate: parseAsString.withDefault(""),
	sort: parseAsStringEnum([...emailProviderSortValues]).withDefault("createdAt"),
	dir: parseAsStringEnum([...emailProviderSortDirectionValues]).withDefault("desc")
};
