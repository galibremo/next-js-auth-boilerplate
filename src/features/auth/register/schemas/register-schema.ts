import { z } from "zod";

import {
  validateEmail,
  validatePassword,
  validateString,
} from "@/validators/common-rule";

export const registerSchema = z.object({
  name: validateString("Name", { min: 1, max: 100 }),
  email: validateEmail,
  password: validatePassword,
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
