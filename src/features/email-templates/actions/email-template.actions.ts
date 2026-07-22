import { apiRoute } from "@/routes/routes";

import type {
  EmailTemplate,
  EmailTemplateListQuery,
  EmailTemplateListResponse,
  UpdateEmailTemplateInput,
} from "@/features/email-templates/types/email-template.types";
import { fetchClient } from "@/lib/api/client";

export async function listEmailTemplates(
  filters: EmailTemplateListQuery,
): Promise<EmailTemplateListResponse> {
  const params: Record<string, string | undefined> = {
    page: String(filters.page),
    pageSize: String(filters.pageSize),
    sort: filters.sort,
    dir: filters.dir,
  };

  if (filters.search) params.search = filters.search;
  if (filters.isActive) params.isActive = filters.isActive;
  if (filters.fromDate) params.fromDate = filters.fromDate;
  if (filters.toDate) params.toDate = filters.toDate;

  return fetchClient<EmailTemplateListResponse>({
    method: "GET",
    url: apiRoute.emailTemplates,
    params,
  });
}

export async function getEmailTemplate(
  publicId: string,
): Promise<EmailTemplate> {
  return fetchClient<EmailTemplate>({
    method: "GET",
    url: apiRoute.emailTemplate(publicId),
  });
}

export async function updateEmailTemplate({
  publicId,
  ...data
}: UpdateEmailTemplateInput): Promise<EmailTemplate> {
  return fetchClient<EmailTemplate>({
    method: "PATCH",
    url: apiRoute.emailTemplate(publicId),
    data,
  });
}
