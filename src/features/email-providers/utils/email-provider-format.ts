import { format } from "date-fns";

import type { EmailProviderType } from "@/features/email-providers/types/email-provider.types";

export function formatEmailProviderDate(value: string): string {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Unknown";
	}

	return format(date, "MMM d, yyyy, h:mm a");
}

export function getProviderTypeLabel(type: EmailProviderType): string {
	switch (type) {
		case "brevo":
			return "Brevo";
		case "resend":
			return "Resend";
		case "email":
			return "Email Server";
		case "ses":
			return "AWS SES";
		case "postmark":
			return "Postmark";
		case "sendgrid":
			return "SendGrid";
		case "cloudflare":
			return "Cloudflare Email";
		case "unosend":
			return "Unosend";
		case "iterable":
			return "Iterable";
		case "mailgun":
			return "Mailgun";
		case "mailersend":
			return "MailerSend";
		case "mailchimp":
			return "Mailchimp";
		case "sparkpost":
			return "SparkPost";
		case "loops":
			return "Loops";
		case "sequenzy":
			return "Sequenzy";
		case "jetemail":
			return "JetEmail";
		case "lettermint":
			return "Lettermint";
		case "primitive":
			return "Primitive";
		case "plunk":
			return "Plunk";
		case "mailtrap":
			return "Mailtrap";
		case "scaleway":
			return "Scaleway";
		case "zeptomail":
			return "ZeptoMail";
		case "mailpace":
			return "MailPace";
	}
}

export function getProviderTypeBadgeVariant(
	type: EmailProviderType
): "default" | "secondary" | "destructive" | "outline" {
	switch (type) {
		case "brevo":
		case "sendgrid":
		case "mailersend":
		case "loops":
		case "plunk":
			return "default";
		case "resend":
		case "postmark":
		case "mailgun":
		case "mailtrap":
		case "sparkpost":
		case "sequenzy":
		case "unosend":
			return "secondary";
		case "ses":
		case "cloudflare":
		case "scaleway":
		case "zeptomail":
		case "mailpace":
			return "destructive";
		case "email":
		case "iterable":
		case "mailchimp":
		case "jetemail":
		case "lettermint":
		case "primitive":
			return "outline";
	}
}
