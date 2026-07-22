import { ResourceErrorAlert } from "@/components/common/resource-error-alert";
import { getEmailLogErrorMessage } from "@/features/email-logs/utils/email-log-errors";

interface EmailLogErrorAlertProps {
	error: unknown;
	title?: string;
	onRetry?: () => void;
}

export function EmailLogErrorAlert({
	error,
	title = "Email log request failed",
	onRetry
}: EmailLogErrorAlertProps) {
	return (
		<ResourceErrorAlert
			error={error}
			title={title}
			onRetry={onRetry}
			getMessage={getEmailLogErrorMessage}
		/>
	);
}
