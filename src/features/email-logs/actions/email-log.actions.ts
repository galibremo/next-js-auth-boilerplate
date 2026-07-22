import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

import { createEmailLogListQuery } from "@/features/email-logs/schemas/email-log-api.schema";
import type {
  EmailLog,
  EmailLogListQuery,
  EmailLogListResponse,
} from "@/features/email-logs/types/email-log.types";

export async function listEmailLogs(
  filters: EmailLogListQuery,
): Promise<EmailLogListResponse> {
  return fetchClient<EmailLogListResponse>({
    method: "GET",
    url: apiRoute.emailLogs,
    params: createEmailLogListQuery(filters),
  });
}

export async function getEmailLog(logId: string): Promise<EmailLog> {
  return fetchClient<EmailLog>({
    method: "GET",
    url: apiRoute.emailLog(logId),
  });
}

export async function resendEmailLog(logId: string): Promise<EmailLog> {
  return fetchClient<EmailLog>({
    method: "POST",
    url: apiRoute.emailLogResend(logId),
  });
}

export async function deleteEmailLog(
  logId: string,
): Promise<{ deleted: boolean }> {
  return fetchClient<{ deleted: boolean }>({
    method: "DELETE",
    url: apiRoute.emailLog(logId),
  });
}
