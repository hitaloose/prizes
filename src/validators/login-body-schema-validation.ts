import { z } from "zod";

export const loginBodySchemaValidator = z.object({
  username: z.string(),
  password: z.string().min(4),
});
