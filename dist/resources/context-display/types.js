// resources/context-display/types.ts
import { z } from "zod";
var propSchema = z.object({
  greeting: z.string(),
  timestamp: z.string(),
  sampleNumbers: z.array(z.number()),
  sampleDates: z.array(z.string())
});
export {
  propSchema
};
//# sourceMappingURL=types.js.map
