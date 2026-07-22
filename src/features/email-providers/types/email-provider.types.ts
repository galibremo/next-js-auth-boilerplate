export type EmailProviderType =
	| "brevo"
	| "resend"
	| "email"
	| "ses"
	| "postmark"
	| "sendgrid"
	| "cloudflare"
	| "unosend"
	| "iterable"
	| "mailgun"
	| "mailersend"
	| "mailchimp"
	| "sparkpost"
	| "loops"
	| "sequenzy"
	| "jetemail"
	| "lettermint"
	| "primitive"
	| "plunk"
	| "mailtrap"
	| "scaleway"
	| "zeptomail"
	| "mailpace";

export const emailProviderTypeValues = [
	"brevo",
	"resend",
	"email",
	"ses",
	"postmark",
	"sendgrid",
	"cloudflare",
	"unosend",
	"iterable",
	"mailgun",
	"mailersend",
	"mailchimp",
	"sparkpost",
	"loops",
	"sequenzy",
	"jetemail",
	"lettermint",
	"primitive",
	"plunk",
	"mailtrap",
	"scaleway",
	"zeptomail",
	"mailpace"
] as const;

export const emailProviderSortValues = [
	"name",
	"providerType",
	"isDefault",
	"isActive",
	"lastTestStatus",
	"createdAt",
	"updatedAt"
] as const;
export const emailProviderSortDirectionValues = ["asc", "desc"] as const;

export type EmailProviderSort = (typeof emailProviderSortValues)[number];
export type EmailProviderSortDirection = (typeof emailProviderSortDirectionValues)[number];

export interface EmailProvider {
	id: string;
	name: string;
	providerType: EmailProviderType;
	config: Record<string, unknown>;
	isDefault: boolean;
	isActive: boolean;
	lastTestedAt: string | null;
	lastTestStatus: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface EmailProviderListQuery {
	page: number;
	pageSize: number;
	search?: string;
	providerType?: string;
	isActive?: string;
	fromDate?: string;
	toDate?: string;
	sort: EmailProviderSort;
	dir: EmailProviderSortDirection;
}

export interface EmailProviderListResponse {
	rows: EmailProvider[];
	total: number;
	page: number;
	pageSize: number;
}

export interface CreateEmailProviderInput {
	name: string;
	providerType: EmailProviderType;
	config: Record<string, unknown>;
}

export interface UpdateEmailProviderInput {
	id: string;
	name?: string;
	config?: Record<string, unknown>;
}

export interface TestConnectionResult {
	success: boolean;
	message: string;
}

// ─── Config interfaces ──────────────────────────────────────────────────────

export interface BrevoConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
}

export interface ResendConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
	headers?: Record<string, string>;
}

export interface EmailServerConfig {
	host: string;
	port: number;
	secure: boolean;
	auth: {
		user: string;
		pass: string;
	};
	senderEmail: string;
	senderName: string;
}

export interface AwsSesConfig {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	senderEmail: string;
	senderName: string;
	sessionToken?: string;
	baseUrl?: string;
	charset?: string;
	configurationSetName?: string;
}

export interface PostmarkConfig {
	serverToken: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
	messageStream?: string;
}

export interface SendgridConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface CloudflareConfig {
	apiToken: string;
	accountId: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface UnosendConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface IterableConfig {
	apiKey: string;
	campaignId: number;
	senderEmail: string;
	senderName: string;
	allowRepeatMarketingSends?: boolean;
	sendAt?: string;
	baseUrl?: string;
}

export interface MailgunConfig {
	apiKey: string;
	domain: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface MailersendConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface MailchimpConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface SparkpostConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
	sandbox?: boolean;
}

export interface LoopsConfig {
	apiKey: string;
	transactionalId: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface SequenzyConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface JetemailConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface LettermintConfig {
	apiToken: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
	route?: string;
}

export interface PrimitiveConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface PlunkConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface MailtrapConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface ScalewayConfig {
	secretKey: string;
	projectId: string;
	senderEmail: string;
	senderName: string;
	region?: string;
	baseUrl?: string;
}

export interface ZeptomailConfig {
	token: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}

export interface MailpaceConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
	baseUrl?: string;
}
