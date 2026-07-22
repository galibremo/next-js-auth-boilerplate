import { useQuery } from "@tanstack/react-query";

import { listProviders } from "./email-provider.actions";
import { emailProviderKeys } from "./email-provider.keys";
import type { EmailProviderListQuery } from "@/features/email-providers/types/email-provider.types";

export function useProvidersQuery(filters: EmailProviderListQuery) {
	return useQuery({
		queryKey: emailProviderKeys.list(filters),
		queryFn: () => listProviders(filters)
	});
}
