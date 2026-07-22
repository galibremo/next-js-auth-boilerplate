import type { Metadata } from "next";

import { EmailProvidersPage } from "@/features/email-providers/components/email-providers-page";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
	return buildPageMetadata({
		title: "Email Providers",
		description: "Manage email service providers."
	});
}

export default function Page() {
	return <EmailProvidersPage />;
}
