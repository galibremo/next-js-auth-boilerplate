"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Alert01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ResourceErrorAlertProps {
  error: unknown;
  title?: string;
  onRetry?: () => void;
  getMessage: (error: unknown) => string;
}

export function ResourceErrorAlert({
  error,
  title = "Request failed",
  onRetry,
  getMessage,
}: ResourceErrorAlertProps) {
  return (
    <Alert variant="destructive" className="py-4">
      <HugeiconsIcon icon={Alert01Icon} className="mt-0.5 shrink-0" />
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{getMessage(error)}</AlertDescription>
        </div>
        {onRetry ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive w-fit"
            onClick={onRetry}
          >
            Retry
          </Button>
        ) : null}
      </div>
    </Alert>
  );
}
