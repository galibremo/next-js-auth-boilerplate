import { apiRoute } from "@/routes/routes";

import { createEmailProviderListQuery } from "@/features/email-providers/schemas/email-provider-api.schema";
import type {
  CreateEmailProviderInput,
  EmailProvider,
  EmailProviderListQuery,
  EmailProviderListResponse,
  TestConnectionResult,
  UpdateEmailProviderInput,
} from "@/features/email-providers/types/email-provider.types";
import { fetchClient } from "@/lib/api/client";

export async function listProviders(
  filters: EmailProviderListQuery,
): Promise<EmailProviderListResponse> {
  return fetchClient<EmailProviderListResponse>({
    method: "GET",
    url: apiRoute.emailProviders,
    params: createEmailProviderListQuery(filters),
  });
}

export async function getProvider(id: string): Promise<EmailProvider> {
  return fetchClient<EmailProvider>({
    method: "GET",
    url: apiRoute.emailProvider(id),
  });
}

export async function createProvider(
  data: CreateEmailProviderInput,
): Promise<EmailProvider> {
  return fetchClient<EmailProvider>({
    method: "POST",
    url: apiRoute.emailProviders,
    data,
  });
}

export async function updateProvider({
  id,
  ...data
}: UpdateEmailProviderInput): Promise<EmailProvider> {
  return fetchClient<EmailProvider>({
    method: "PATCH",
    url: apiRoute.emailProvider(id),
    data,
  });
}

export async function deleteProvider(
  id: string,
): Promise<{ deleted: boolean }> {
  return fetchClient<{ deleted: boolean }>({
    method: "DELETE",
    url: apiRoute.emailProvider(id),
  });
}

export async function testConnection(
  id: string,
): Promise<TestConnectionResult> {
  return fetchClient<TestConnectionResult>({
    method: "POST",
    url: apiRoute.emailProviderTest(id),
  });
}

export async function setDefault(id: string): Promise<EmailProvider> {
  return fetchClient<EmailProvider>({
    method: "POST",
    url: apiRoute.emailProviderSetDefault(id),
  });
}

export async function toggleProvider(id: string): Promise<EmailProvider> {
  return fetchClient<EmailProvider>({
    method: "PATCH",
    url: apiRoute.emailProviderToggle(id),
  });
}
