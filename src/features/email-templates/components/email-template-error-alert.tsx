"use client";

import { ResourceErrorAlert } from "@/components/common/resource-error-alert";

interface EmailTemplateErrorAlertProps {
	error: unknown;
	onRetry: () => void;
}

function getEmailTemplateErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : "Failed to load email templates";
}

export function EmailTemplateErrorAlert({ error, onRetry }: EmailTemplateErrorAlertProps) {
	return (
		<ResourceErrorAlert
			error={error}
			title="Email template request failed"
			onRetry={onRetry}
			getMessage={getEmailTemplateErrorMessage}
		/>
	);
}
