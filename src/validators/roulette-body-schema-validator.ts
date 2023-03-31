import { z } from "zod";

export const rouletteBodySchemaValidator = z.object({
  costumer_name: z.string(),
});
