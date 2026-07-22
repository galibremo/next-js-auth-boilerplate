"use client";

import { Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmailLogErrorAlert } from "@/features/email-logs/components/email-log-error-alert";
import { EmailLogsTable } from "@/features/email-logs/components/email-logs-table";
import {
  EmailLogListProvider,
  useEmailLogList,
} from "@/features/email-logs/hooks/use-email-log-list";

import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";
import { toast } from "sonner";

const breadcrumbItems = [
  { name: "Dashboard", href: route.private.dashboard },
  { name: "Email Logs", isCurrent: true },
];

export function EmailLogsPage() {
  return (
    <EmailLogListProvider>
      <EmailLogsPageContent />
    </EmailLogListProvider>
  );
}

function EmailLogsPageContent() {
  const { error, handleRefresh } = useEmailLogList();

  useEffect(() => {
    if (!error) return;
    toast.error("Failed to load email logs");
    console.log(error);
  }, [error]);

  return (
    <>
      <SetBreadcrumb items={breadcrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-normal">
              <HugeiconsIcon
                icon={Mail01Icon}
                className="text-primary size-6"
              />
              Email Logs
            </h1>
            <p className="text-muted-foreground text-sm">
              Track all email send attempts across your email providers.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Email Send History</CardTitle>
            <CardDescription>
              Filter, sort, and inspect email delivery attempts. Resend or
              delete individual logs.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <EmailLogErrorAlert error={error} onRetry={handleRefresh} />
            ) : null}
            <EmailLogsTable />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
