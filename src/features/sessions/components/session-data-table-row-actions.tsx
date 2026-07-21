"use client";

import {
  ComputerRemoveIcon,
  Delete02Icon,
  ShieldBanIcon,
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
  useDeleteSessionMutation,
  useRevokeSessionMutation,
} from "@/features/sessions/actions/sessions.mutations";
import type { Session } from "@/features/sessions/types/sessions.types";
import { route } from "@/routes/routes";

interface SessionDataTableRowActionsProps {
  session: Session;
}

export function SessionDataTableRowActions({
  session,
}: SessionDataTableRowActionsProps) {
  const router = useRouter();
  const revokeSessionMutation = useRevokeSessionMutation();
  const deleteSessionMutation = useDeleteSessionMutation();

  const handleRevokeSession = () => {
    revokeSessionMutation.mutate(session.id, {
      onSuccess: () => {
        if (session.isCurrent) {
          toast.success("Session revoked. Please sign in again.");
          router.replace(route.protected.login);
          return;
        }

        toast.success("Session revoked successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to revoke session");
        console.log(error);
      },
    });
  };

  const handleDeleteSession = () => {
    deleteSessionMutation.mutate(session.id, {
      onSuccess: () => {
        toast.success("Session deleted from history");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete session");
        console.log(error);
      },
    });
  };

  if (session.status === "active") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            disabled={revokeSessionMutation.isPending}
          >
            <HugeiconsIcon icon={ComputerRemoveIcon} data-icon="inline-start" />
            {revokeSessionMutation.isPending ? "Revoking" : "Revoke"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <HugeiconsIcon icon={ShieldBanIcon} />
            </AlertDialogMedia>
            <AlertDialogTitle>
              {session.isCurrent
                ? "Revoke your current session?"
                : "Revoke this session?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {session.isCurrent
                ? "This will sign you out on this device and send you back to login. The session will remain in your history as Revoked."
                : `This will sign out ${session.deviceName} from your account. The session will remain in your history as Revoked.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleRevokeSession}
            >
              Revoke session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (session.status === "revoked" || session.status === "expired") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={deleteSessionMutation.isPending}
          >
            <HugeiconsIcon icon={Delete02Icon} data-icon="inline-start" />
            {deleteSessionMutation.isPending ? "Deleting" : "Delete"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <HugeiconsIcon icon={Delete02Icon} />
            </AlertDialogMedia>
            <AlertDialogTitle>
              Delete this session from history?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the {session.status} session for{" "}
              {session.deviceName} from your session history. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteSession}
            >
              Delete session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return <span className="text-muted-foreground text-sm">No action</span>;
}
