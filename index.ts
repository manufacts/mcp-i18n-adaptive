import { MCPServer } from "mcp-use";
import { z } from "zod";

const server = new MCPServer({
  name: "i18n-adaptive",
  title: "i18n Adaptive",
  version: "1.0.0",
  description:
    "Host context explorer — locale, timezone, layout constraints, and device detection",
  favicon: "favicon.ico",
  icons: [
    { src: "icon.svg", mimeType: "image/svg+xml", sizes: ["512x512"] },
  ],
});

const contextDisplaySchema = z.object({
  greeting: z.string(),
  timestamp: z.string(),
  sampleNumbers: z.array(z.number()),
  sampleDates: z.array(z.string()),
});

export const showContext = server.tool(
  {
    name: "show-context",
    description:
      "Display the host context inspector showing locale, timezone, layout constraints, device info, and adaptive formatting.",
    inputSchema: z.object({}),
    outputSchema: contextDisplaySchema,
    view: {
      name: "context-display",
      description: "Host context inspector — locale, timezone, layout, and device",
      prefersBorder: true,
    },
  },
  async () => {
    const data = {
      greeting: "Hello!",
      timestamp: new Date().toISOString(),
      sampleNumbers: [1234.56, 9876543.21, 0.005],
      sampleDates: [
        new Date().toISOString(),
        new Date(Date.now() - 86400000).toISOString(),
      ],
    };
    return {
      content: [{ type: "text", text: "Context display loaded" }],
      structuredContent: data,
    };
  },
);

export const detectCaller = server.tool(
  {
    name: "detect-caller",
    description:
      "Detect the calling client's user context and connection info — userId, conversationId, locale, location, client name and version.",
    inputSchema: z.object({}),
    outputSchema: z.object({
      userId: z.string().nullable(),
      conversationId: z.string().nullable(),
      locale: z.string().nullable(),
      location: z.unknown().nullable(),
      client: z.object({ name: z.string(), version: z.string() }),
    }),
  },
  async (_, ctx) => {
    const user = ctx.client.user();
    const info = ctx.client.info();

    const data = {
      userId: user?.subject ?? null,
      conversationId: user?.conversationId ?? null,
      locale: user?.locale ?? null,
      location: user?.location ?? null,
      client: {
        name: info?.name ?? "unknown",
        version: info?.version ?? "unknown",
      },
    };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: data,
    };
  },
);

export default server;
