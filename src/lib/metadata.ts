import type { Metadata } from "next";

export function joinTitleParts(...parts: Array<string | null | undefined>): string {
	return parts
		.map(part => part?.trim())
		.filter((part): part is string => Boolean(part && part.length > 0))
		.join(" · ");
}

type PageMetaInput = {
	title: string;
	description: string;
	robots?: Metadata["robots"];
};

export function buildPageMetadata({ title, description, robots }: PageMetaInput): Metadata {
	return {
		title,
		description,
		...(robots !== undefined ? { robots } : {})
	};
}

export function buildPublicPageMetadata({
	title,
	description
}: Omit<PageMetaInput, "robots">): Metadata {
	return {
		title,
		description,
		openGraph: {
			title,
			description
		},
		twitter: {
			card: "summary",
			title,
			description
		}
	};
}

export function buildNoIndexPageMetadata({
	title,
	description
}: Omit<PageMetaInput, "robots">): Metadata {
	return buildPageMetadata({
		title,
		description,
		robots: { index: false, follow: false }
	});
}
