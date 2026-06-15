import { MCPServer, text, widget, object } from "mcp-use/server";
import { z } from "zod";

const server = new MCPServer({
  name: "i18n-adaptive",
  title: "i18n Adaptive",
  version: "1.0.0",
  description:
    "Host context explorer — locale, timezone, layout constraints, and device detection",
  baseUrl: process.env.MCP_URL || "http://localhost:3000",
  favicon: "favicon.ico",
  icons: [
    { src: "icon.svg", mimeType: "image/svg+xml", sizes: ["512x512"] },
  ],
});

server.tool(
  {
    name: "show-context",
    description:
      "Display the host context inspector showing locale, timezone, layout constraints, device info, and adaptive formatting.",
    schema: z.object({}),
    widget: {
      name: "context-display",
      invoking: "Loading context…",
      invoked: "Context ready",
    },
  },
  async () => {
    return widget({
      props: {
        greeting: "Hello!",
        timestamp: new Date().toISOString(),
        sampleNumbers: [1234.56, 9876543.21, 0.005],
        sampleDates: [
          new Date().toISOString(),
          new Date(Date.now() - 86400000).toISOString(),
        ],
      },
      output: text("Context display loaded"),
    });
  },
);

server.tool(
  {
    name: "detect-caller",
    description:
      "Detect the calling client's user context and connection info — userId, conversationId, locale, location, client name and version.",
    schema: z.object({}),
  },
  async (_, ctx) => {
    const user = ctx.client.user();
    const info = ctx.client.info();

    return object({
      userId: user?.subject ?? null,
      conversationId: user?.conversationId ?? null,
      locale: user?.locale ?? null,
      location: user?.location ?? null,
      client: {
        name: info?.name ?? "unknown",
        version: info?.version ?? "unknown",
      },
    });
  },
);

server.listen().then(() => console.log("i18n Adaptive running"));
