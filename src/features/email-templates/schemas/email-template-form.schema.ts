import { z } from "zod";

import { validateBoolean, validateString } from "@/validators/common-rule";

export const emailTemplateFormSchema = z.object({
	subject: validateString("Subject", { min: 1 }),
	html: validateString("HTML", { min: 1 }),
	text: validateString("Text").optional().or(z.literal("")),
	isActive: validateBoolean("Is Active")
});

export type EmailTemplateFormValues = z.infer<typeof emailTemplateFormSchema>;
