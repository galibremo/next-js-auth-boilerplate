"use client";

import {
  Delete02Icon,
  Edit02Icon,
  Mail01Icon,
  MoreVerticalIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDeleteProviderMutation,
  useSetDefaultMutation,
  useTestConnectionMutation,
  useToggleProviderMutation,
} from "@/features/email-providers/actions/email-provider.mutations";
import type { EmailProvider } from "@/features/email-providers/types/email-provider.types";

interface EmailProviderDataTableRowActionsProps {
  provider: EmailProvider;
  onEdit: (provider: EmailProvider) => void;
}

export function EmailProviderDataTableRowActions({
  provider,
  onEdit,
}: EmailProviderDataTableRowActionsProps) {
  const router = useRouter();
  const deleteMutation = useDeleteProviderMutation();
  const setDefaultMutation = useSetDefaultMutation();
  const testMutation = useTestConnectionMutation();
  const toggleMutation = useToggleProviderMutation();

  const handleDelete = () => {
    deleteMutation.mutate(provider.id, {
      onSuccess: () => {
        toast.success("Provider deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete provider");
      },
    });
  };

  const handleSetDefault = () => {
    setDefaultMutation.mutate(provider.id, {
      onSuccess: () => {
        toast.success(`${provider.name} set as default`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to set default");
      },
    });
  };

  const handleTest = () => {
    testMutation.mutate(provider.id, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      },
      onError: () => {
        toast.error("Connection test failed");
      },
    });
  };

  const handleToggle = () => {
    toggleMutation.mutate(provider.id, {
      onSuccess: () => {
        toast.success(
          `Provider ${provider.isActive ? "deactivated" : "activated"}`,
        );
      },
      onError: (error) => {
        toast.error(error.message || "Failed to toggle provider");
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Open actions for ${provider.name}`}
          >
            <HugeiconsIcon icon={MoreVerticalIcon} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(provider)}>
            <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleTest}>
            <HugeiconsIcon icon={Mail01Icon} data-icon="inline-start" />
            Test Connection
          </DropdownMenuItem>
          {!provider.isDefault && (
            <DropdownMenuItem onClick={handleSetDefault}>
              <HugeiconsIcon icon={StarIcon} data-icon="inline-start" />
              Set as Default
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleToggle}>
            {provider.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive"
              >
                <HugeiconsIcon icon={Delete02Icon} data-icon="inline-start" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <HugeiconsIcon icon={Delete02Icon} />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete provider?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete &quot;{provider.name}&quot;. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
