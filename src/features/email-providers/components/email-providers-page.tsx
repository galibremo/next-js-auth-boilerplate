"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmailProviderErrorAlert } from "@/features/email-providers/components/email-provider-error-alert";
import { EmailProviderFormSheet } from "@/features/email-providers/components/email-provider-form-sheet";
import { EmailProvidersTable } from "@/features/email-providers/components/email-providers-table";
import {
  EmailProviderListProvider,
  useEmailProviderList,
} from "@/features/email-providers/hooks/use-email-provider-list";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

import { Mail01Icon, PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const breadcrumbItems = [
  { name: "Dashboard", href: route.private.dashboard },
  { name: "Email Providers", isCurrent: true },
];

export function EmailProvidersPage() {
  return (
    <EmailProviderListProvider>
      <EmailProvidersPageContent />
    </EmailProviderListProvider>
  );
}

function EmailProvidersPageContent() {
  const { error, handleRefresh } = useEmailProviderList();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (!error) return;
    toast.error("Failed to load email providers");
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
              Email Providers
            </h1>
            <p className="text-muted-foreground text-sm">
              Configure email providers for sending application emails. The
              default provider is used first, with automatic fallback to other
              active providers.
            </p>
          </div>
          <Button type="button" size="sm" onClick={() => setIsCreateOpen(true)}>
            <HugeiconsIcon icon={PlusSignCircleIcon} data-icon="inline-start" />
            Add Provider
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Email Providers</CardTitle>
            <CardDescription>
              Manage email providers, test connections, and set defaults.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <EmailProviderErrorAlert error={error} onRetry={handleRefresh} />
            ) : null}
            <EmailProvidersTable />
          </CardContent>
        </Card>

        <EmailProviderFormSheet
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      </div>
    </>
  );
}
