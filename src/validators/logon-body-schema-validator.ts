import { z } from "zod";

export const logonBodySchemaValidator = z
  .object({
    username: z.string(),
    password: z.string().min(4),
    password_confirmation: z.string().min(4),
  })
  .superRefine((schema, context) => {
    const { password, password_confirmation } = schema;

    if (password_confirmation !== password) {
      context.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["password", "password_confirmation"],
      });
    }
  });
