import type { Metadata } from "next";

import { EmailTemplatesPage } from "@/features/email-templates/components/email-templates-page";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
	return buildPageMetadata({
		title: "Email Templates",
		description: "Manage and edit email templates."
	});
}

export default function Page() {
	return <EmailTemplatesPage />;
}
