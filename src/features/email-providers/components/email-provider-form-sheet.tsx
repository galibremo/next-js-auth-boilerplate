"use client";

import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback } from "react";
import type { HTMLInputTypeAttribute } from "react";
import {
	Controller,
	FormProvider,
	useForm,
	useFormContext,
	useWatch
} from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
	useCreateProviderMutation,
	useUpdateProviderMutation
} from "@/features/email-providers/actions/email-provider.mutations";
import type {
	AwsSesConfig,
	BrevoConfig,
	CloudflareConfig,
	EmailProvider,
	EmailProviderType,
	EmailServerConfig,
	IterableConfig,
	JetemailConfig,
	LettermintConfig,
	LoopsConfig,
	MailchimpConfig,
	MailersendConfig,
	MailgunConfig,
	MailpaceConfig,
	MailtrapConfig,
	PlunkConfig,
	PostmarkConfig,
	PrimitiveConfig,
	ResendConfig,
	ScalewayConfig,
	SendgridConfig,
	SequenzyConfig,
	SparkpostConfig,
	UnosendConfig,
	ZeptomailConfig
} from "@/features/email-providers/types/email-provider.types";
import { getProviderTypeLabel } from "@/features/email-providers/utils/email-provider-format";
import { ApiError } from "@/lib/api/errors";

interface EmailProviderFormSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	provider?: EmailProvider | null;
}

interface EmailProviderFormFieldsProps {
	idPrefix: string;
	isEditing: boolean;
	disabled: boolean;
}

interface EmailProviderFormValues {
	name: string;
	providerType: EmailProviderType;
	// brevo
	brevoApiKey: string;
	brevoSenderEmail: string;
	brevoSenderName: string;
	// resend
	resendApiKey: string;
	resendSenderEmail: string;
	resendSenderName: string;
	resendBaseUrl: string;
	// email (SMTP)
	emailHost: string;
	emailPort: number;
	emailSecure: boolean;
	emailUser: string;
	emailPass: string;
	emailSenderEmail: string;
	emailSenderName: string;
	// ses (AWS SES)
	awsAccessKeyId: string;
	awsSecretAccessKey: string;
	awsRegion: string;
	awsSenderEmail: string;
	awsSenderName: string;
	awsSessionToken: string;
	awsBaseUrl: string;
	// postmark
	postmarkServerToken: string;
	postmarkSenderEmail: string;
	postmarkSenderName: string;
	postmarkBaseUrl: string;
	postmarkMessageStream: string;
	// sendgrid
	sendgridApiKey: string;
	sendgridSenderEmail: string;
	sendgridSenderName: string;
	sendgridBaseUrl: string;
	// cloudflare
	cloudflareApiToken: string;
	cloudflareAccountId: string;
	cloudflareSenderEmail: string;
	cloudflareSenderName: string;
	cloudflareBaseUrl: string;
	// unosend
	unosendApiKey: string;
	unosendSenderEmail: string;
	unosendSenderName: string;
	unosendBaseUrl: string;
	// iterable
	iterableApiKey: string;
	iterableCampaignId: number;
	iterableSenderEmail: string;
	iterableSenderName: string;
	iterableBaseUrl: string;
	iterableAllowRepeatMarketingSends: boolean;
	// mailgun
	mailgunApiKey: string;
	mailgunDomain: string;
	mailgunSenderEmail: string;
	mailgunSenderName: string;
	mailgunBaseUrl: string;
	// mailersend
	mailersendApiKey: string;
	mailersendSenderEmail: string;
	mailersendSenderName: string;
	mailersendBaseUrl: string;
	// mailchimp
	mailchimpApiKey: string;
	mailchimpSenderEmail: string;
	mailchimpSenderName: string;
	mailchimpBaseUrl: string;
	// sparkpost
	sparkpostApiKey: string;
	sparkpostSenderEmail: string;
	sparkpostSenderName: string;
	sparkpostBaseUrl: string;
	sparkpostSandbox: boolean;
	// loops
	loopsApiKey: string;
	loopsTransactionalId: string;
	loopsSenderEmail: string;
	loopsSenderName: string;
	loopsBaseUrl: string;
	// sequenzy
	sequenzyApiKey: string;
	sequenzySenderEmail: string;
	sequenzySenderName: string;
	sequenzyBaseUrl: string;
	// jetemail
	jetemailApiKey: string;
	jetemailSenderEmail: string;
	jetemailSenderName: string;
	jetemailBaseUrl: string;
	// lettermint
	lettermintApiToken: string;
	lettermintSenderEmail: string;
	lettermintSenderName: string;
	lettermintBaseUrl: string;
	lettermintRoute: string;
	// primitive
	primitiveApiKey: string;
	primitiveSenderEmail: string;
	primitiveSenderName: string;
	primitiveBaseUrl: string;
	// plunk
	plunkApiKey: string;
	plunkSenderEmail: string;
	plunkSenderName: string;
	plunkBaseUrl: string;
	// mailtrap
	mailtrapApiKey: string;
	mailtrapSenderEmail: string;
	mailtrapSenderName: string;
	mailtrapBaseUrl: string;
	// scaleway
	scalewaySecretKey: string;
	scalewayProjectId: string;
	scalewaySenderEmail: string;
	scalewaySenderName: string;
	scalewayRegion: string;
	scalewayBaseUrl: string;
	// zeptomail
	zeptomailToken: string;
	zeptomailSenderEmail: string;
	zeptomailSenderName: string;
	zeptomailBaseUrl: string;
	// mailpace
	mailpaceApiKey: string;
	mailpaceSenderEmail: string;
	mailpaceSenderName: string;
	mailpaceBaseUrl: string;
}

type BooleanFieldName = "emailSecure" | "iterableAllowRepeatMarketingSends" | "sparkpostSandbox";

type InputFieldName = Exclude<keyof EmailProviderFormValues, "providerType" | BooleanFieldName>;

interface ControlledInputFieldProps {
	name: InputFieldName;
	id: string;
	label: string;
	type?: HTMLInputTypeAttribute;
	placeholder?: string;
	disabled?: boolean;
	valueAsNumber?: boolean;
}

const MASKED_VALUE = "••••••••";

const PROVIDER_TYPE_OPTIONS: Array<{ value: EmailProviderType; label: string }> = [
	{ value: "brevo", label: "Brevo" },
	{ value: "cloudflare", label: "Cloudflare Email" },
	{ value: "email", label: "Email Server (SMTP)" },
	{ value: "iterable", label: "Iterable" },
	{ value: "jetemail", label: "JetEmail" },
	{ value: "lettermint", label: "Lettermint" },
	{ value: "loops", label: "Loops" },
	{ value: "mailchimp", label: "Mailchimp" },
	{ value: "mailersend", label: "MailerSend" },
	{ value: "mailgun", label: "Mailgun" },
	{ value: "mailpace", label: "MailPace" },
	{ value: "mailtrap", label: "Mailtrap" },
	{ value: "plunk", label: "Plunk" },
	{ value: "postmark", label: "Postmark" },
	{ value: "primitive", label: "Primitive" },
	{ value: "resend", label: "Resend" },
	{ value: "scaleway", label: "Scaleway" },
	{ value: "sendgrid", label: "SendGrid" },
	{ value: "sequenzy", label: "Sequenzy" },
	{ value: "ses", label: "AWS SES" },
	{ value: "sparkpost", label: "SparkPost" },
	{ value: "unosend", label: "Unosend" },
	{ value: "zeptomail", label: "ZeptoMail" }
];

export function EmailProviderFormSheet({
	open,
	onOpenChange,
	provider
}: EmailProviderFormSheetProps) {
	const isEditing = !!provider;
	const createMutation = useCreateProviderMutation();
	const updateMutation = useUpdateProviderMutation();
	const isPending = createMutation.isPending || updateMutation.isPending;

	const form = useForm<EmailProviderFormValues>({
		defaultValues: getDefaultValues(provider)
	});

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (nextOpen) {
				form.reset(getDefaultValues(provider));
			}
			onOpenChange(nextOpen);
		},
		[provider, form, onOpenChange]
	);

	const buildConfig = (values: EmailProviderFormValues): Record<string, unknown> => {
		const omitIfBlank = (v: string) => v.trim() || undefined;

		switch (values.providerType) {
			case "brevo": {
				const config: Record<string, unknown> = {
					apiKey: values.brevoApiKey === MASKED_VALUE && isEditing ? undefined : values.brevoApiKey,
					senderEmail: values.brevoSenderEmail,
					senderName: values.brevoSenderName
				};
				if (isEditing && values.brevoApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "resend": {
				const config: Record<string, unknown> = {
					apiKey: values.resendApiKey === MASKED_VALUE && isEditing ? undefined : values.resendApiKey,
					senderEmail: values.resendSenderEmail,
					senderName: values.resendSenderName,
					...(omitIfBlank(values.resendBaseUrl) && { baseUrl: values.resendBaseUrl.trim() })
				};
				if (isEditing && values.resendApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "email": {
				const config: Record<string, unknown> = {
					host: values.emailHost,
					port: values.emailPort,
					secure: values.emailSecure,
					auth: {
						user: values.emailUser,
						pass: values.emailPass === MASKED_VALUE && isEditing ? undefined : values.emailPass
					},
					senderEmail: values.emailSenderEmail,
					senderName: values.emailSenderName
				};
				if (isEditing && values.emailPass === MASKED_VALUE) {
					delete (config.auth as Record<string, unknown>).pass;
				}
				return config;
			}
			case "ses": {
				const config: Record<string, unknown> = {
					accessKeyId:
						values.awsAccessKeyId === MASKED_VALUE && isEditing ? undefined : values.awsAccessKeyId,
					secretAccessKey:
						values.awsSecretAccessKey === MASKED_VALUE && isEditing
							? undefined
							: values.awsSecretAccessKey,
					region: values.awsRegion,
					senderEmail: values.awsSenderEmail,
					senderName: values.awsSenderName,
					...(omitIfBlank(values.awsSessionToken) && { sessionToken: values.awsSessionToken.trim() }),
					...(omitIfBlank(values.awsBaseUrl) && { baseUrl: values.awsBaseUrl.trim() })
				};
				if (isEditing && values.awsAccessKeyId === MASKED_VALUE) delete config.accessKeyId;
				if (isEditing && values.awsSecretAccessKey === MASKED_VALUE) delete config.secretAccessKey;
				return config;
			}
			case "postmark": {
				const config: Record<string, unknown> = {
					serverToken:
						values.postmarkServerToken === MASKED_VALUE && isEditing
							? undefined
							: values.postmarkServerToken,
					senderEmail: values.postmarkSenderEmail,
					senderName: values.postmarkSenderName,
					...(omitIfBlank(values.postmarkBaseUrl) && { baseUrl: values.postmarkBaseUrl.trim() }),
					...(omitIfBlank(values.postmarkMessageStream) && {
						messageStream: values.postmarkMessageStream.trim()
					})
				};
				if (isEditing && values.postmarkServerToken === MASKED_VALUE) delete config.serverToken;
				return config;
			}
			case "sendgrid": {
				const config: Record<string, unknown> = {
					apiKey:
						values.sendgridApiKey === MASKED_VALUE && isEditing ? undefined : values.sendgridApiKey,
					senderEmail: values.sendgridSenderEmail,
					senderName: values.sendgridSenderName,
					...(omitIfBlank(values.sendgridBaseUrl) && { baseUrl: values.sendgridBaseUrl.trim() })
				};
				if (isEditing && values.sendgridApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "cloudflare": {
				const config: Record<string, unknown> = {
					apiToken:
						values.cloudflareApiToken === MASKED_VALUE && isEditing
							? undefined
							: values.cloudflareApiToken,
					accountId: values.cloudflareAccountId,
					senderEmail: values.cloudflareSenderEmail,
					senderName: values.cloudflareSenderName,
					...(omitIfBlank(values.cloudflareBaseUrl) && { baseUrl: values.cloudflareBaseUrl.trim() })
				};
				if (isEditing && values.cloudflareApiToken === MASKED_VALUE) delete config.apiToken;
				return config;
			}
			case "unosend": {
				const config: Record<string, unknown> = {
					apiKey:
						values.unosendApiKey === MASKED_VALUE && isEditing ? undefined : values.unosendApiKey,
					senderEmail: values.unosendSenderEmail,
					senderName: values.unosendSenderName,
					...(omitIfBlank(values.unosendBaseUrl) && { baseUrl: values.unosendBaseUrl.trim() })
				};
				if (isEditing && values.unosendApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "iterable": {
				const config: Record<string, unknown> = {
					apiKey:
						values.iterableApiKey === MASKED_VALUE && isEditing ? undefined : values.iterableApiKey,
					campaignId: values.iterableCampaignId,
					senderEmail: values.iterableSenderEmail,
					senderName: values.iterableSenderName,
					allowRepeatMarketingSends: values.iterableAllowRepeatMarketingSends,
					...(omitIfBlank(values.iterableBaseUrl) && { baseUrl: values.iterableBaseUrl.trim() })
				};
				if (isEditing && values.iterableApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "mailgun": {
				const config: Record<string, unknown> = {
					apiKey:
						values.mailgunApiKey === MASKED_VALUE && isEditing ? undefined : values.mailgunApiKey,
					domain: values.mailgunDomain,
					senderEmail: values.mailgunSenderEmail,
					senderName: values.mailgunSenderName,
					...(omitIfBlank(values.mailgunBaseUrl) && { baseUrl: values.mailgunBaseUrl.trim() })
				};
				if (isEditing && values.mailgunApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "mailersend": {
				const config: Record<string, unknown> = {
					apiKey:
						values.mailersendApiKey === MASKED_VALUE && isEditing
							? undefined
							: values.mailersendApiKey,
					senderEmail: values.mailersendSenderEmail,
					senderName: values.mailersendSenderName,
					...(omitIfBlank(values.mailersendBaseUrl) && { baseUrl: values.mailersendBaseUrl.trim() })
				};
				if (isEditing && values.mailersendApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "mailchimp": {
				const config: Record<string, unknown> = {
					apiKey:
						values.mailchimpApiKey === MASKED_VALUE && isEditing ? undefined : values.mailchimpApiKey,
					senderEmail: values.mailchimpSenderEmail,
					senderName: values.mailchimpSenderName,
					...(omitIfBlank(values.mailchimpBaseUrl) && { baseUrl: values.mailchimpBaseUrl.trim() })
				};
				if (isEditing && values.mailchimpApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "sparkpost": {
				const config: Record<string, unknown> = {
					apiKey:
						values.sparkpostApiKey === MASKED_VALUE && isEditing ? undefined : values.sparkpostApiKey,
					senderEmail: values.sparkpostSenderEmail,
					senderName: values.sparkpostSenderName,
					sandbox: values.sparkpostSandbox,
					...(omitIfBlank(values.sparkpostBaseUrl) && { baseUrl: values.sparkpostBaseUrl.trim() })
				};
				if (isEditing && values.sparkpostApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "loops": {
				const config: Record<string, unknown> = {
					apiKey: values.loopsApiKey === MASKED_VALUE && isEditing ? undefined : values.loopsApiKey,
					transactionalId: values.loopsTransactionalId,
					senderEmail: values.loopsSenderEmail,
					senderName: values.loopsSenderName,
					...(omitIfBlank(values.loopsBaseUrl) && { baseUrl: values.loopsBaseUrl.trim() })
				};
				if (isEditing && values.loopsApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "sequenzy": {
				const config: Record<string, unknown> = {
					apiKey:
						values.sequenzyApiKey === MASKED_VALUE && isEditing ? undefined : values.sequenzyApiKey,
					senderEmail: values.sequenzySenderEmail,
					senderName: values.sequenzySenderName,
					...(omitIfBlank(values.sequenzyBaseUrl) && { baseUrl: values.sequenzyBaseUrl.trim() })
				};
				if (isEditing && values.sequenzyApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "jetemail": {
				const config: Record<string, unknown> = {
					apiKey:
						values.jetemailApiKey === MASKED_VALUE && isEditing ? undefined : values.jetemailApiKey,
					senderEmail: values.jetemailSenderEmail,
					senderName: values.jetemailSenderName,
					...(omitIfBlank(values.jetemailBaseUrl) && { baseUrl: values.jetemailBaseUrl.trim() })
				};
				if (isEditing && values.jetemailApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "lettermint": {
				const config: Record<string, unknown> = {
					apiToken:
						values.lettermintApiToken === MASKED_VALUE && isEditing
							? undefined
							: values.lettermintApiToken,
					senderEmail: values.lettermintSenderEmail,
					senderName: values.lettermintSenderName,
					...(omitIfBlank(values.lettermintBaseUrl) && { baseUrl: values.lettermintBaseUrl.trim() }),
					...(omitIfBlank(values.lettermintRoute) && { route: values.lettermintRoute.trim() })
				};
				if (isEditing && values.lettermintApiToken === MASKED_VALUE) delete config.apiToken;
				return config;
			}
			case "primitive": {
				const config: Record<string, unknown> = {
					apiKey:
						values.primitiveApiKey === MASKED_VALUE && isEditing ? undefined : values.primitiveApiKey,
					senderEmail: values.primitiveSenderEmail,
					senderName: values.primitiveSenderName,
					...(omitIfBlank(values.primitiveBaseUrl) && { baseUrl: values.primitiveBaseUrl.trim() })
				};
				if (isEditing && values.primitiveApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "plunk": {
				const config: Record<string, unknown> = {
					apiKey: values.plunkApiKey === MASKED_VALUE && isEditing ? undefined : values.plunkApiKey,
					senderEmail: values.plunkSenderEmail,
					senderName: values.plunkSenderName,
					...(omitIfBlank(values.plunkBaseUrl) && { baseUrl: values.plunkBaseUrl.trim() })
				};
				if (isEditing && values.plunkApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "mailtrap": {
				const config: Record<string, unknown> = {
					apiKey:
						values.mailtrapApiKey === MASKED_VALUE && isEditing ? undefined : values.mailtrapApiKey,
					senderEmail: values.mailtrapSenderEmail,
					senderName: values.mailtrapSenderName,
					...(omitIfBlank(values.mailtrapBaseUrl) && { baseUrl: values.mailtrapBaseUrl.trim() })
				};
				if (isEditing && values.mailtrapApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
			case "scaleway": {
				const config: Record<string, unknown> = {
					secretKey:
						values.scalewaySecretKey === MASKED_VALUE && isEditing
							? undefined
							: values.scalewaySecretKey,
					projectId: values.scalewayProjectId,
					senderEmail: values.scalewaySenderEmail,
					senderName: values.scalewaySenderName,
					...(omitIfBlank(values.scalewayRegion) && { region: values.scalewayRegion.trim() }),
					...(omitIfBlank(values.scalewayBaseUrl) && { baseUrl: values.scalewayBaseUrl.trim() })
				};
				if (isEditing && values.scalewaySecretKey === MASKED_VALUE) delete config.secretKey;
				return config;
			}
			case "zeptomail": {
				const config: Record<string, unknown> = {
					token:
						values.zeptomailToken === MASKED_VALUE && isEditing ? undefined : values.zeptomailToken,
					senderEmail: values.zeptomailSenderEmail,
					senderName: values.zeptomailSenderName,
					...(omitIfBlank(values.zeptomailBaseUrl) && { baseUrl: values.zeptomailBaseUrl.trim() })
				};
				if (isEditing && values.zeptomailToken === MASKED_VALUE) delete config.token;
				return config;
			}
			case "mailpace": {
				const config: Record<string, unknown> = {
					apiKey:
						values.mailpaceApiKey === MASKED_VALUE && isEditing ? undefined : values.mailpaceApiKey,
					senderEmail: values.mailpaceSenderEmail,
					senderName: values.mailpaceSenderName,
					...(omitIfBlank(values.mailpaceBaseUrl) && { baseUrl: values.mailpaceBaseUrl.trim() })
				};
				if (isEditing && values.mailpaceApiKey === MASKED_VALUE) delete config.apiKey;
				return config;
			}
		}
	};

	const onSubmit = async (values: EmailProviderFormValues) => {
		const name = values.name.trim();
		if (!name) {
			toast.error("Name is required");
			return;
		}

		const config = buildConfig(values);

		try {
			if (isEditing && provider) {
				await updateMutation.mutateAsync({
					id: provider.id,
					name,
					config
				});
				toast.success("Provider updated");
			} else {
				await createMutation.mutateAsync({
					name,
					providerType: values.providerType,
					config
				});
				toast.success("Provider created");
			}
			handleOpenChange(false);
		} catch (error) {
			const message = error instanceof ApiError ? error.message : "Failed to save provider";
			toast.error(message);
		}
	};

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent key={provider?.id ?? "create"} className="flex flex-col sm:max-w-lg">
				<FormProvider {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex min-h-0 flex-1 flex-col"
					>
						<SheetHeader>
							<SheetTitle>{isEditing ? "Edit Provider" : "Add Email Provider"}</SheetTitle>
							<SheetDescription>
								{isEditing
									? "Update the provider configuration. Leave sensitive fields unchanged to keep existing values."
									: "Configure a new email provider for sending application emails."}
							</SheetDescription>
						</SheetHeader>

						<div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
							<EmailProviderFormFields
								idPrefix={provider ? `email-provider-${provider.id}` : "email-provider-create"}
								isEditing={isEditing}
								disabled={isPending}
							/>
						</div>

						<SheetFooter className="sm:justify-between">
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? (
									<>
										<HugeiconsIcon icon={Loading03Icon} data-icon="inline-start" />
										{isEditing ? "Saving..." : "Creating..."}
									</>
								) : isEditing ? (
									"Save Changes"
								) : (
									"Create Provider"
								)}
							</Button>
						</SheetFooter>
					</form>
				</FormProvider>
			</SheetContent>
		</Sheet>
	);
}

function EmailProviderFormFields({
	idPrefix,
	isEditing,
	disabled
}: EmailProviderFormFieldsProps) {
	const { control } = useFormContext<EmailProviderFormValues>();
	const providerType = useWatch({ control, name: "providerType" });

	return (
		<FieldGroup className="gap-4">
			<ControlledInputField
				name="name"
				id={`${idPrefix}-name`}
				label="Name"
				placeholder={`Production ${getProviderTypeLabel(providerType)}`}
				disabled={disabled}
			/>

			{!isEditing ? (
				<Field>
					<FieldLabel htmlFor={`${idPrefix}-provider-type`}>Provider Type</FieldLabel>
					<Controller
						name="providerType"
						control={control}
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={value => field.onChange(value as EmailProviderType)}
								disabled={disabled}
							>
								<SelectTrigger id={`${idPrefix}-provider-type`} className="w-full">
									<SelectValue placeholder="Select provider type" />
								</SelectTrigger>
								<SelectContent>
									{PROVIDER_TYPE_OPTIONS.map(option => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				</Field>
			) : null}

			{/* ── brevo ── */}
			{providerType === "brevo" ? (
				<>
					<ControlledInputField
						name="brevoApiKey"
						id={`${idPrefix}-brevo-api-key`}
						label="API Key"
						type="password"
						placeholder="xkeysib-..."
						disabled={disabled}
					/>
					<ControlledInputField
						name="brevoSenderEmail"
						id={`${idPrefix}-brevo-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="brevoSenderName"
						id={`${idPrefix}-brevo-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── resend ── */}
			{providerType === "resend" ? (
				<>
					<ControlledInputField
						name="resendApiKey"
						id={`${idPrefix}-resend-api-key`}
						label="API Key"
						type="password"
						placeholder="re_..."
						disabled={disabled}
					/>
					<ControlledInputField
						name="resendSenderEmail"
						id={`${idPrefix}-resend-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="resendSenderName"
						id={`${idPrefix}-resend-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="resendBaseUrl"
						id={`${idPrefix}-resend-base-url`}
						label="Base URL (optional)"
						placeholder="https://api.resend.com"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── email (SMTP) ── */}
			{providerType === "email" ? (
				<>
					<div className="grid gap-4 sm:grid-cols-2">
						<ControlledInputField
							name="emailHost"
							id={`${idPrefix}-email-host`}
							label="Host"
							placeholder="mail.example.com"
							disabled={disabled}
						/>
						<ControlledInputField
							name="emailPort"
							id={`${idPrefix}-email-port`}
							label="Port"
							type="number"
							placeholder="587"
							disabled={disabled}
							valueAsNumber
						/>
					</div>
					<Field
						orientation="horizontal"
						className="items-center justify-between rounded-2xl border p-3"
					>
						<div>
							<FieldLabel htmlFor={`${idPrefix}-email-secure`}>Use SSL/TLS</FieldLabel>
							<FieldDescription>Enable secure Email connections.</FieldDescription>
						</div>
						<Controller
							name="emailSecure"
							control={control}
							render={({ field }) => (
								<Switch
									id={`${idPrefix}-email-secure`}
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={disabled}
								/>
							)}
						/>
					</Field>
					<ControlledInputField
						name="emailUser"
						id={`${idPrefix}-email-user`}
						label="Username"
						disabled={disabled}
					/>
					<ControlledInputField
						name="emailPass"
						id={`${idPrefix}-email-pass`}
						label="Password"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="emailSenderEmail"
						id={`${idPrefix}-email-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="emailSenderName"
						id={`${idPrefix}-email-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── ses (AWS SES) ── */}
			{providerType === "ses" ? (
				<>
					<ControlledInputField
						name="awsAccessKeyId"
						id={`${idPrefix}-aws-access-key-id`}
						label="Access Key ID"
						disabled={disabled}
					/>
					<ControlledInputField
						name="awsSecretAccessKey"
						id={`${idPrefix}-aws-secret-access-key`}
						label="Secret Access Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="awsRegion"
						id={`${idPrefix}-aws-region`}
						label="Region"
						placeholder="us-east-1"
						disabled={disabled}
					/>
					<ControlledInputField
						name="awsSenderEmail"
						id={`${idPrefix}-aws-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="awsSenderName"
						id={`${idPrefix}-aws-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="awsSessionToken"
						id={`${idPrefix}-aws-session-token`}
						label="Session Token (optional)"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="awsBaseUrl"
						id={`${idPrefix}-aws-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── postmark ── */}
			{providerType === "postmark" ? (
				<>
					<ControlledInputField
						name="postmarkServerToken"
						id={`${idPrefix}-postmark-server-token`}
						label="Server Token"
						type="password"
						placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
						disabled={disabled}
					/>
					<ControlledInputField
						name="postmarkSenderEmail"
						id={`${idPrefix}-postmark-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="postmarkSenderName"
						id={`${idPrefix}-postmark-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="postmarkMessageStream"
						id={`${idPrefix}-postmark-message-stream`}
						label="Message Stream (optional)"
						placeholder="outbound"
						disabled={disabled}
					/>
					<ControlledInputField
						name="postmarkBaseUrl"
						id={`${idPrefix}-postmark-base-url`}
						label="Base URL (optional)"
						placeholder="https://api.postmarkapp.com"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── sendgrid ── */}
			{providerType === "sendgrid" ? (
				<>
					<ControlledInputField
						name="sendgridApiKey"
						id={`${idPrefix}-sendgrid-api-key`}
						label="API Key"
						type="password"
						placeholder="SG...."
						disabled={disabled}
					/>
					<ControlledInputField
						name="sendgridSenderEmail"
						id={`${idPrefix}-sendgrid-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="sendgridSenderName"
						id={`${idPrefix}-sendgrid-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="sendgridBaseUrl"
						id={`${idPrefix}-sendgrid-base-url`}
						label="Base URL (optional)"
						placeholder="https://api.sendgrid.com"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── cloudflare ── */}
			{providerType === "cloudflare" ? (
				<>
					<ControlledInputField
						name="cloudflareApiToken"
						id={`${idPrefix}-cloudflare-api-token`}
						label="API Token"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="cloudflareAccountId"
						id={`${idPrefix}-cloudflare-account-id`}
						label="Account ID"
						disabled={disabled}
					/>
					<ControlledInputField
						name="cloudflareSenderEmail"
						id={`${idPrefix}-cloudflare-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="cloudflareSenderName"
						id={`${idPrefix}-cloudflare-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="cloudflareBaseUrl"
						id={`${idPrefix}-cloudflare-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── unosend ── */}
			{providerType === "unosend" ? (
				<>
					<ControlledInputField
						name="unosendApiKey"
						id={`${idPrefix}-unosend-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="unosendSenderEmail"
						id={`${idPrefix}-unosend-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="unosendSenderName"
						id={`${idPrefix}-unosend-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="unosendBaseUrl"
						id={`${idPrefix}-unosend-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── iterable ── */}
			{providerType === "iterable" ? (
				<>
					<ControlledInputField
						name="iterableApiKey"
						id={`${idPrefix}-iterable-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="iterableCampaignId"
						id={`${idPrefix}-iterable-campaign-id`}
						label="Campaign ID"
						type="number"
						placeholder="123456"
						disabled={disabled}
						valueAsNumber
					/>
					<ControlledInputField
						name="iterableSenderEmail"
						id={`${idPrefix}-iterable-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="iterableSenderName"
						id={`${idPrefix}-iterable-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<Field
						orientation="horizontal"
						className="items-center justify-between rounded-2xl border p-3"
					>
						<div>
							<FieldLabel htmlFor={`${idPrefix}-iterable-repeat`}>
								Allow Repeat Marketing Sends
							</FieldLabel>
							<FieldDescription>
								Send marketing emails to contacts who already received them.
							</FieldDescription>
						</div>
						<Controller
							name="iterableAllowRepeatMarketingSends"
							control={control}
							render={({ field }) => (
								<Switch
									id={`${idPrefix}-iterable-repeat`}
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={disabled}
								/>
							)}
						/>
					</Field>
					<ControlledInputField
						name="iterableBaseUrl"
						id={`${idPrefix}-iterable-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── mailgun ── */}
			{providerType === "mailgun" ? (
				<>
					<ControlledInputField
						name="mailgunApiKey"
						id={`${idPrefix}-mailgun-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailgunDomain"
						id={`${idPrefix}-mailgun-domain`}
						label="Domain"
						placeholder="mg.example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailgunSenderEmail"
						id={`${idPrefix}-mailgun-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailgunSenderName"
						id={`${idPrefix}-mailgun-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailgunBaseUrl"
						id={`${idPrefix}-mailgun-base-url`}
						label="Base URL (optional)"
						placeholder="https://api.mailgun.net"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── mailersend ── */}
			{providerType === "mailersend" ? (
				<>
					<ControlledInputField
						name="mailersendApiKey"
						id={`${idPrefix}-mailersend-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailersendSenderEmail"
						id={`${idPrefix}-mailersend-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailersendSenderName"
						id={`${idPrefix}-mailersend-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailersendBaseUrl"
						id={`${idPrefix}-mailersend-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── mailchimp ── */}
			{providerType === "mailchimp" ? (
				<>
					<ControlledInputField
						name="mailchimpApiKey"
						id={`${idPrefix}-mailchimp-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailchimpSenderEmail"
						id={`${idPrefix}-mailchimp-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailchimpSenderName"
						id={`${idPrefix}-mailchimp-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailchimpBaseUrl"
						id={`${idPrefix}-mailchimp-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── sparkpost ── */}
			{providerType === "sparkpost" ? (
				<>
					<ControlledInputField
						name="sparkpostApiKey"
						id={`${idPrefix}-sparkpost-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="sparkpostSenderEmail"
						id={`${idPrefix}-sparkpost-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="sparkpostSenderName"
						id={`${idPrefix}-sparkpost-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<Field
						orientation="horizontal"
						className="items-center justify-between rounded-2xl border p-3"
					>
						<div>
							<FieldLabel htmlFor={`${idPrefix}-sparkpost-sandbox`}>Sandbox Mode</FieldLabel>
							<FieldDescription>
								Send emails in sandbox mode without delivering to recipients.
							</FieldDescription>
						</div>
						<Controller
							name="sparkpostSandbox"
							control={control}
							render={({ field }) => (
								<Switch
									id={`${idPrefix}-sparkpost-sandbox`}
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={disabled}
								/>
							)}
						/>
					</Field>
					<ControlledInputField
						name="sparkpostBaseUrl"
						id={`${idPrefix}-sparkpost-base-url`}
						label="Base URL (optional)"
						placeholder="https://api.sparkpost.com"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── loops ── */}
			{providerType === "loops" ? (
				<>
					<ControlledInputField
						name="loopsApiKey"
						id={`${idPrefix}-loops-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="loopsTransactionalId"
						id={`${idPrefix}-loops-transactional-id`}
						label="Transactional ID"
						disabled={disabled}
					/>
					<ControlledInputField
						name="loopsSenderEmail"
						id={`${idPrefix}-loops-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="loopsSenderName"
						id={`${idPrefix}-loops-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="loopsBaseUrl"
						id={`${idPrefix}-loops-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── sequenzy ── */}
			{providerType === "sequenzy" ? (
				<>
					<ControlledInputField
						name="sequenzyApiKey"
						id={`${idPrefix}-sequenzy-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="sequenzySenderEmail"
						id={`${idPrefix}-sequenzy-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="sequenzySenderName"
						id={`${idPrefix}-sequenzy-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="sequenzyBaseUrl"
						id={`${idPrefix}-sequenzy-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── jetemail ── */}
			{providerType === "jetemail" ? (
				<>
					<ControlledInputField
						name="jetemailApiKey"
						id={`${idPrefix}-jetemail-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="jetemailSenderEmail"
						id={`${idPrefix}-jetemail-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="jetemailSenderName"
						id={`${idPrefix}-jetemail-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="jetemailBaseUrl"
						id={`${idPrefix}-jetemail-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── lettermint ── */}
			{providerType === "lettermint" ? (
				<>
					<ControlledInputField
						name="lettermintApiToken"
						id={`${idPrefix}-lettermint-api-token`}
						label="API Token"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="lettermintSenderEmail"
						id={`${idPrefix}-lettermint-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="lettermintSenderName"
						id={`${idPrefix}-lettermint-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="lettermintRoute"
						id={`${idPrefix}-lettermint-route`}
						label="Route (optional)"
						disabled={disabled}
					/>
					<ControlledInputField
						name="lettermintBaseUrl"
						id={`${idPrefix}-lettermint-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── primitive ── */}
			{providerType === "primitive" ? (
				<>
					<ControlledInputField
						name="primitiveApiKey"
						id={`${idPrefix}-primitive-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="primitiveSenderEmail"
						id={`${idPrefix}-primitive-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="primitiveSenderName"
						id={`${idPrefix}-primitive-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="primitiveBaseUrl"
						id={`${idPrefix}-primitive-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── plunk ── */}
			{providerType === "plunk" ? (
				<>
					<ControlledInputField
						name="plunkApiKey"
						id={`${idPrefix}-plunk-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="plunkSenderEmail"
						id={`${idPrefix}-plunk-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="plunkSenderName"
						id={`${idPrefix}-plunk-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="plunkBaseUrl"
						id={`${idPrefix}-plunk-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── mailtrap ── */}
			{providerType === "mailtrap" ? (
				<>
					<ControlledInputField
						name="mailtrapApiKey"
						id={`${idPrefix}-mailtrap-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailtrapSenderEmail"
						id={`${idPrefix}-mailtrap-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailtrapSenderName"
						id={`${idPrefix}-mailtrap-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailtrapBaseUrl"
						id={`${idPrefix}-mailtrap-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── scaleway ── */}
			{providerType === "scaleway" ? (
				<>
					<ControlledInputField
						name="scalewaySecretKey"
						id={`${idPrefix}-scaleway-secret-key`}
						label="Secret Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="scalewayProjectId"
						id={`${idPrefix}-scaleway-project-id`}
						label="Project ID"
						disabled={disabled}
					/>
					<ControlledInputField
						name="scalewaySenderEmail"
						id={`${idPrefix}-scaleway-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="scalewaySenderName"
						id={`${idPrefix}-scaleway-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="scalewayRegion"
						id={`${idPrefix}-scaleway-region`}
						label="Region (optional)"
						placeholder="fr-par"
						disabled={disabled}
					/>
					<ControlledInputField
						name="scalewayBaseUrl"
						id={`${idPrefix}-scaleway-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── zeptomail ── */}
			{providerType === "zeptomail" ? (
				<>
					<ControlledInputField
						name="zeptomailToken"
						id={`${idPrefix}-zeptomail-token`}
						label="Token"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="zeptomailSenderEmail"
						id={`${idPrefix}-zeptomail-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="zeptomailSenderName"
						id={`${idPrefix}-zeptomail-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="zeptomailBaseUrl"
						id={`${idPrefix}-zeptomail-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}

			{/* ── mailpace ── */}
			{providerType === "mailpace" ? (
				<>
					<ControlledInputField
						name="mailpaceApiKey"
						id={`${idPrefix}-mailpace-api-key`}
						label="API Key"
						type="password"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailpaceSenderEmail"
						id={`${idPrefix}-mailpace-sender-email`}
						label="Sender Email"
						type="email"
						placeholder="noreply@example.com"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailpaceSenderName"
						id={`${idPrefix}-mailpace-sender-name`}
						label="Sender Name"
						placeholder="My App"
						disabled={disabled}
					/>
					<ControlledInputField
						name="mailpaceBaseUrl"
						id={`${idPrefix}-mailpace-base-url`}
						label="Base URL (optional)"
						disabled={disabled}
					/>
				</>
			) : null}
		</FieldGroup>
	);
}

function ControlledInputField({
	name,
	id,
	label,
	type = "text",
	placeholder,
	disabled,
	valueAsNumber = false
}: ControlledInputFieldProps) {
	const { control } = useFormContext<EmailProviderFormValues>();

	return (
		<Field>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Controller
				name={name}
				control={control}
				render={({ field, fieldState }) => (
					<>
						<Input
							id={id}
							type={type}
							name={field.name}
							ref={field.ref}
							value={formatInputValue(field.value)}
							onBlur={field.onBlur}
							onChange={event =>
								field.onChange(
									valueAsNumber
										? parseNumberInput(event.currentTarget.value, event.currentTarget.valueAsNumber)
										: event.currentTarget.value
								)
							}
							placeholder={placeholder}
							disabled={disabled}
						/>
						<FieldError>{fieldState.error?.message}</FieldError>
					</>
				)}
			/>
		</Field>
	);
}

function parseNumberInput(value: string, valueAsNumber: number): number {
	return value === "" ? Number.NaN : valueAsNumber;
}

function formatInputValue(value: string | number): string | number {
	if (typeof value === "number" && Number.isNaN(value)) {
		return "";
	}

	return value;
}

// ─── Default values ───────────────────────────────────────────────────────────

function getDefaultValues(provider: EmailProvider | null | undefined): EmailProviderFormValues {
	if (provider) {
		const config = provider.config as Record<string, unknown>;
		return {
			name: provider.name,
			providerType: provider.providerType,
			// brevo
			brevoApiKey: MASKED_VALUE,
			brevoSenderEmail: (config as unknown as BrevoConfig)?.senderEmail ?? "",
			brevoSenderName: (config as unknown as BrevoConfig)?.senderName ?? "",
			// resend
			resendApiKey: MASKED_VALUE,
			resendSenderEmail: (config as unknown as ResendConfig)?.senderEmail ?? "",
			resendSenderName: (config as unknown as ResendConfig)?.senderName ?? "",
			resendBaseUrl: (config as unknown as ResendConfig)?.baseUrl ?? "",
			// email (SMTP)
			emailHost: (config as unknown as EmailServerConfig)?.host ?? "",
			emailPort: (config as unknown as EmailServerConfig)?.port ?? 587,
			emailSecure: (config as unknown as EmailServerConfig)?.secure ?? false,
			emailUser: (config as unknown as EmailServerConfig)?.auth?.user ?? "",
			emailPass: MASKED_VALUE,
			emailSenderEmail: (config as unknown as EmailServerConfig)?.senderEmail ?? "",
			emailSenderName: (config as unknown as EmailServerConfig)?.senderName ?? "",
			// ses
			awsAccessKeyId: (config as unknown as AwsSesConfig)?.accessKeyId ?? "",
			awsSecretAccessKey: MASKED_VALUE,
			awsRegion: (config as unknown as AwsSesConfig)?.region ?? "",
			awsSenderEmail: (config as unknown as AwsSesConfig)?.senderEmail ?? "",
			awsSenderName: (config as unknown as AwsSesConfig)?.senderName ?? "",
			awsSessionToken: "",
			awsBaseUrl: (config as unknown as AwsSesConfig)?.baseUrl ?? "",
			// postmark
			postmarkServerToken: MASKED_VALUE,
			postmarkSenderEmail: (config as unknown as PostmarkConfig)?.senderEmail ?? "",
			postmarkSenderName: (config as unknown as PostmarkConfig)?.senderName ?? "",
			postmarkBaseUrl: (config as unknown as PostmarkConfig)?.baseUrl ?? "",
			postmarkMessageStream: (config as unknown as PostmarkConfig)?.messageStream ?? "",
			// sendgrid
			sendgridApiKey: MASKED_VALUE,
			sendgridSenderEmail: (config as unknown as SendgridConfig)?.senderEmail ?? "",
			sendgridSenderName: (config as unknown as SendgridConfig)?.senderName ?? "",
			sendgridBaseUrl: (config as unknown as SendgridConfig)?.baseUrl ?? "",
			// cloudflare
			cloudflareApiToken: MASKED_VALUE,
			cloudflareAccountId: (config as unknown as CloudflareConfig)?.accountId ?? "",
			cloudflareSenderEmail: (config as unknown as CloudflareConfig)?.senderEmail ?? "",
			cloudflareSenderName: (config as unknown as CloudflareConfig)?.senderName ?? "",
			cloudflareBaseUrl: (config as unknown as CloudflareConfig)?.baseUrl ?? "",
			// unosend
			unosendApiKey: MASKED_VALUE,
			unosendSenderEmail: (config as unknown as UnosendConfig)?.senderEmail ?? "",
			unosendSenderName: (config as unknown as UnosendConfig)?.senderName ?? "",
			unosendBaseUrl: (config as unknown as UnosendConfig)?.baseUrl ?? "",
			// iterable
			iterableApiKey: MASKED_VALUE,
			iterableCampaignId: (config as unknown as IterableConfig)?.campaignId ?? Number.NaN,
			iterableSenderEmail: (config as unknown as IterableConfig)?.senderEmail ?? "",
			iterableSenderName: (config as unknown as IterableConfig)?.senderName ?? "",
			iterableBaseUrl: (config as unknown as IterableConfig)?.baseUrl ?? "",
			iterableAllowRepeatMarketingSends:
				(config as unknown as IterableConfig)?.allowRepeatMarketingSends ?? false,
			// mailgun
			mailgunApiKey: MASKED_VALUE,
			mailgunDomain: (config as unknown as MailgunConfig)?.domain ?? "",
			mailgunSenderEmail: (config as unknown as MailgunConfig)?.senderEmail ?? "",
			mailgunSenderName: (config as unknown as MailgunConfig)?.senderName ?? "",
			mailgunBaseUrl: (config as unknown as MailgunConfig)?.baseUrl ?? "",
			// mailersend
			mailersendApiKey: MASKED_VALUE,
			mailersendSenderEmail: (config as unknown as MailersendConfig)?.senderEmail ?? "",
			mailersendSenderName: (config as unknown as MailersendConfig)?.senderName ?? "",
			mailersendBaseUrl: (config as unknown as MailersendConfig)?.baseUrl ?? "",
			// mailchimp
			mailchimpApiKey: MASKED_VALUE,
			mailchimpSenderEmail: (config as unknown as MailchimpConfig)?.senderEmail ?? "",
			mailchimpSenderName: (config as unknown as MailchimpConfig)?.senderName ?? "",
			mailchimpBaseUrl: (config as unknown as MailchimpConfig)?.baseUrl ?? "",
			// sparkpost
			sparkpostApiKey: MASKED_VALUE,
			sparkpostSenderEmail: (config as unknown as SparkpostConfig)?.senderEmail ?? "",
			sparkpostSenderName: (config as unknown as SparkpostConfig)?.senderName ?? "",
			sparkpostBaseUrl: (config as unknown as SparkpostConfig)?.baseUrl ?? "",
			sparkpostSandbox: (config as unknown as SparkpostConfig)?.sandbox ?? false,
			// loops
			loopsApiKey: MASKED_VALUE,
			loopsTransactionalId: (config as unknown as LoopsConfig)?.transactionalId ?? "",
			loopsSenderEmail: (config as unknown as LoopsConfig)?.senderEmail ?? "",
			loopsSenderName: (config as unknown as LoopsConfig)?.senderName ?? "",
			loopsBaseUrl: (config as unknown as LoopsConfig)?.baseUrl ?? "",
			// sequenzy
			sequenzyApiKey: MASKED_VALUE,
			sequenzySenderEmail: (config as unknown as SequenzyConfig)?.senderEmail ?? "",
			sequenzySenderName: (config as unknown as SequenzyConfig)?.senderName ?? "",
			sequenzyBaseUrl: (config as unknown as SequenzyConfig)?.baseUrl ?? "",
			// jetemail
			jetemailApiKey: MASKED_VALUE,
			jetemailSenderEmail: (config as unknown as JetemailConfig)?.senderEmail ?? "",
			jetemailSenderName: (config as unknown as JetemailConfig)?.senderName ?? "",
			jetemailBaseUrl: (config as unknown as JetemailConfig)?.baseUrl ?? "",
			// lettermint
			lettermintApiToken: MASKED_VALUE,
			lettermintSenderEmail: (config as unknown as LettermintConfig)?.senderEmail ?? "",
			lettermintSenderName: (config as unknown as LettermintConfig)?.senderName ?? "",
			lettermintBaseUrl: (config as unknown as LettermintConfig)?.baseUrl ?? "",
			lettermintRoute: (config as unknown as LettermintConfig)?.route ?? "",
			// primitive
			primitiveApiKey: MASKED_VALUE,
			primitiveSenderEmail: (config as unknown as PrimitiveConfig)?.senderEmail ?? "",
			primitiveSenderName: (config as unknown as PrimitiveConfig)?.senderName ?? "",
			primitiveBaseUrl: (config as unknown as PrimitiveConfig)?.baseUrl ?? "",
			// plunk
			plunkApiKey: MASKED_VALUE,
			plunkSenderEmail: (config as unknown as PlunkConfig)?.senderEmail ?? "",
			plunkSenderName: (config as unknown as PlunkConfig)?.senderName ?? "",
			plunkBaseUrl: (config as unknown as PlunkConfig)?.baseUrl ?? "",
			// mailtrap
			mailtrapApiKey: MASKED_VALUE,
			mailtrapSenderEmail: (config as unknown as MailtrapConfig)?.senderEmail ?? "",
			mailtrapSenderName: (config as unknown as MailtrapConfig)?.senderName ?? "",
			mailtrapBaseUrl: (config as unknown as MailtrapConfig)?.baseUrl ?? "",
			// scaleway
			scalewaySecretKey: MASKED_VALUE,
			scalewayProjectId: (config as unknown as ScalewayConfig)?.projectId ?? "",
			scalewaySenderEmail: (config as unknown as ScalewayConfig)?.senderEmail ?? "",
			scalewaySenderName: (config as unknown as ScalewayConfig)?.senderName ?? "",
			scalewayRegion: (config as unknown as ScalewayConfig)?.region ?? "",
			scalewayBaseUrl: (config as unknown as ScalewayConfig)?.baseUrl ?? "",
			// zeptomail
			zeptomailToken: MASKED_VALUE,
			zeptomailSenderEmail: (config as unknown as ZeptomailConfig)?.senderEmail ?? "",
			zeptomailSenderName: (config as unknown as ZeptomailConfig)?.senderName ?? "",
			zeptomailBaseUrl: (config as unknown as ZeptomailConfig)?.baseUrl ?? "",
			// mailpace
			mailpaceApiKey: MASKED_VALUE,
			mailpaceSenderEmail: (config as unknown as MailpaceConfig)?.senderEmail ?? "",
			mailpaceSenderName: (config as unknown as MailpaceConfig)?.senderName ?? "",
			mailpaceBaseUrl: (config as unknown as MailpaceConfig)?.baseUrl ?? ""
		};
	}

	return {
		name: "",
		providerType: "brevo",
		// brevo
		brevoApiKey: "",
		brevoSenderEmail: "",
		brevoSenderName: "",
		// resend
		resendApiKey: "",
		resendSenderEmail: "",
		resendSenderName: "",
		resendBaseUrl: "",
		// email (SMTP)
		emailHost: "",
		emailPort: 587,
		emailSecure: false,
		emailUser: "",
		emailPass: "",
		emailSenderEmail: "",
		emailSenderName: "",
		// ses
		awsAccessKeyId: "",
		awsSecretAccessKey: "",
		awsRegion: "",
		awsSenderEmail: "",
		awsSenderName: "",
		awsSessionToken: "",
		awsBaseUrl: "",
		// postmark
		postmarkServerToken: "",
		postmarkSenderEmail: "",
		postmarkSenderName: "",
		postmarkBaseUrl: "",
		postmarkMessageStream: "",
		// sendgrid
		sendgridApiKey: "",
		sendgridSenderEmail: "",
		sendgridSenderName: "",
		sendgridBaseUrl: "",
		// cloudflare
		cloudflareApiToken: "",
		cloudflareAccountId: "",
		cloudflareSenderEmail: "",
		cloudflareSenderName: "",
		cloudflareBaseUrl: "",
		// unosend
		unosendApiKey: "",
		unosendSenderEmail: "",
		unosendSenderName: "",
		unosendBaseUrl: "",
		// iterable
		iterableApiKey: "",
		iterableCampaignId: Number.NaN,
		iterableSenderEmail: "",
		iterableSenderName: "",
		iterableBaseUrl: "",
		iterableAllowRepeatMarketingSends: false,
		// mailgun
		mailgunApiKey: "",
		mailgunDomain: "",
		mailgunSenderEmail: "",
		mailgunSenderName: "",
		mailgunBaseUrl: "",
		// mailersend
		mailersendApiKey: "",
		mailersendSenderEmail: "",
		mailersendSenderName: "",
		mailersendBaseUrl: "",
		// mailchimp
		mailchimpApiKey: "",
		mailchimpSenderEmail: "",
		mailchimpSenderName: "",
		mailchimpBaseUrl: "",
		// sparkpost
		sparkpostApiKey: "",
		sparkpostSenderEmail: "",
		sparkpostSenderName: "",
		sparkpostBaseUrl: "",
		sparkpostSandbox: false,
		// loops
		loopsApiKey: "",
		loopsTransactionalId: "",
		loopsSenderEmail: "",
		loopsSenderName: "",
		loopsBaseUrl: "",
		// sequenzy
		sequenzyApiKey: "",
		sequenzySenderEmail: "",
		sequenzySenderName: "",
		sequenzyBaseUrl: "",
		// jetemail
		jetemailApiKey: "",
		jetemailSenderEmail: "",
		jetemailSenderName: "",
		jetemailBaseUrl: "",
		// lettermint
		lettermintApiToken: "",
		lettermintSenderEmail: "",
		lettermintSenderName: "",
		lettermintBaseUrl: "",
		lettermintRoute: "",
		// primitive
		primitiveApiKey: "",
		primitiveSenderEmail: "",
		primitiveSenderName: "",
		primitiveBaseUrl: "",
		// plunk
		plunkApiKey: "",
		plunkSenderEmail: "",
		plunkSenderName: "",
		plunkBaseUrl: "",
		// mailtrap
		mailtrapApiKey: "",
		mailtrapSenderEmail: "",
		mailtrapSenderName: "",
		mailtrapBaseUrl: "",
		// scaleway
		scalewaySecretKey: "",
		scalewayProjectId: "",
		scalewaySenderEmail: "",
		scalewaySenderName: "",
		scalewayRegion: "",
		scalewayBaseUrl: "",
		// zeptomail
		zeptomailToken: "",
		zeptomailSenderEmail: "",
		zeptomailSenderName: "",
		zeptomailBaseUrl: "",
		// mailpace
		mailpaceApiKey: "",
		mailpaceSenderEmail: "",
		mailpaceSenderName: "",
		mailpaceBaseUrl: ""
	};
}
