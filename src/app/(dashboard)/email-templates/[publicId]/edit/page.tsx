import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/metadata";

import { EmailTemplateEditPage } from "@/features/email-templates/components/email-template-edit-page";

interface PageProps {
	params: Promise<{ publicId: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
	return buildPageMetadata({
		title: "Edit Email Template",
		description: "Edit the content and settings of this email template."
	});
}

export default async function Page({ params }: PageProps) {
	const { publicId } = await params;

	return <EmailTemplateEditPage publicId={publicId} />;
}
