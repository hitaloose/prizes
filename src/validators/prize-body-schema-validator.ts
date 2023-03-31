import { z } from "zod";

export const prizeBodySchemaValidator = z.object({
  product_prizeed_id: z.string(),
});
