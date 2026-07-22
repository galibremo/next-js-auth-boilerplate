import { ResourceErrorAlert } from "@/components/common/resource-error-alert";

interface EmailProviderErrorAlertProps {
	error: unknown;
	title?: string;
	onRetry?: () => void;
}

function getEmailProviderErrorMessage(error: unknown): string {
	return error instanceof Error
		? error.message
		: "Failed to load email providers. Please try again.";
}

export function EmailProviderErrorAlert({
	error,
	title = "Provider request failed",
	onRetry
}: EmailProviderErrorAlertProps) {
	return (
		<ResourceErrorAlert
			error={error}
			title={title}
			onRetry={onRetry}
			getMessage={getEmailProviderErrorMessage}
		/>
	);
}
