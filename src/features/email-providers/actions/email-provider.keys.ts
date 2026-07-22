import type { EmailProviderListQuery } from "@/features/email-providers/types/email-provider.types";

export const emailProviderKeys = {
	all: ["email-providers"] as const,
	lists: () => [...emailProviderKeys.all, "list"] as const,
	list: (filters: EmailProviderListQuery) => [...emailProviderKeys.lists(), filters] as const
};
