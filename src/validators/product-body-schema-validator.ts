import { z } from "zod";

export const productBodySchemaValidator = z.object({
  name: z.string(),
  stock: z.number().min(0),
});
