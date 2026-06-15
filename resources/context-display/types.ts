import { z } from "zod";

export const propSchema = z.object({
  greeting: z.string(),
  timestamp: z.string(),
  sampleNumbers: z.array(z.number()),
  sampleDates: z.array(z.string()),
});

export type ContextDisplayProps = z.infer<typeof propSchema>;
