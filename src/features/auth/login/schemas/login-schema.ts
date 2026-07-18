import { z } from "zod";

import { validateEmail, validateString } from "@/validators/common-rule";

export const loginSchema = z.object({
  email: validateEmail,
  password: validateString("Password", { min: 8, max: 255 }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
