// .mcp-use/context-display/entry.tsx
import { createRoot } from "react-dom/client";

// resources/context-display/widget.tsx
import {
  McpUseProvider,
  useWidget
} from "mcp-use/react";
import { useMemo } from "react";

// resources/context-display/types.ts
import { z } from "zod";
var propSchema = z.object({
  greeting: z.string(),
  timestamp: z.string(),
  sampleNumbers: z.array(z.number()),
  sampleDates: z.array(z.string())
});

// resources/context-display/widget.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function StatusDot({ active }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `inline-block w-2.5 h-2.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-500"}`
    }
  );
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-3 py-2 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsx("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: title }) }),
    /* @__PURE__ */ jsx("div", { className: "px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100", children })
  ] });
}
function KV({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-2 py-0.5", children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400 shrink-0", children: label }),
    /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-gray-800 dark:text-gray-200 text-right truncate", children: value ?? "\u2014" })
  ] });
}
function SafeAreaBox({
  safeArea
}) {
  const insets = safeArea.insets ?? { top: 0, right: 0, bottom: 0, left: 0 };
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full h-28 rounded border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] text-gray-400 dark:text-gray-500", children: [
    /* @__PURE__ */ jsx("span", { className: "absolute top-1 left-1/2 -translate-x-1/2 font-mono", children: insets.top }),
    /* @__PURE__ */ jsx("span", { className: "absolute bottom-1 left-1/2 -translate-x-1/2 font-mono", children: insets.bottom }),
    /* @__PURE__ */ jsx("span", { className: "absolute left-1.5 top-1/2 -translate-y-1/2 font-mono", children: insets.left }),
    /* @__PURE__ */ jsx("span", { className: "absolute right-1.5 top-1/2 -translate-y-1/2 font-mono", children: insets.right }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded",
        style: {
          position: "absolute",
          top: `${insets.top}px`,
          right: `${insets.right}px`,
          bottom: `${insets.bottom}px`,
          left: `${insets.left}px`,
          minWidth: 20,
          minHeight: 20
        }
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "z-10 text-gray-400 dark:text-gray-500", children: "safe area" })
  ] });
}
var ContextDisplay = () => {
  const {
    props,
    isPending,
    locale,
    timeZone,
    userAgent,
    safeArea,
    maxWidth,
    maxHeight,
    hostInfo,
    hostCapabilities,
    isAvailable,
    output,
    theme,
    displayMode
  } = useWidget();
  const gridCols = useMemo(() => {
    if (!maxWidth || maxWidth < 400) return 1;
    if (maxWidth < 800) return 2;
    return 3;
  }, [maxWidth]);
  const formattedNumbers = useMemo(() => {
    if (!props?.sampleNumbers) return [];
    try {
      const fmt = new Intl.NumberFormat(locale || void 0);
      return props.sampleNumbers.map((n) => ({
        raw: n,
        formatted: fmt.format(n)
      }));
    } catch {
      return props.sampleNumbers.map((n) => ({
        raw: n,
        formatted: String(n)
      }));
    }
  }, [props?.sampleNumbers, locale]);
  const formattedDates = useMemo(() => {
    if (!props?.sampleDates) return [];
    try {
      const fmt = new Intl.DateTimeFormat(locale || void 0, {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: timeZone || void 0
      });
      return props.sampleDates.map((d) => ({
        raw: d,
        formatted: fmt.format(new Date(d))
      }));
    } catch {
      return props.sampleDates.map((d) => ({ raw: d, formatted: d }));
    }
  }, [props?.sampleDates, locale, timeZone]);
  if (isPending) {
    return /* @__PURE__ */ jsx(McpUseProvider, { autoSize: true, children: /* @__PURE__ */ jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Detecting host context\u2026" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx(McpUseProvider, { autoSize: true, children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 mb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-gray-900 dark:text-gray-100", children: "Host Context Inspector" }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400 dark:text-gray-500", children: props?.greeting })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "gap-3",
        style: {
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`
        },
        children: [
          /* @__PURE__ */ jsx(Section, { title: "Connection", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(StatusDot, { active: !!isAvailable }),
            /* @__PURE__ */ jsx("span", { className: "text-xs", children: isAvailable ? "Connected" : "Disconnected" })
          ] }) }),
          /* @__PURE__ */ jsxs(Section, { title: "Host", children: [
            /* @__PURE__ */ jsx(KV, { label: "Name", value: hostInfo?.name ?? "unknown" }),
            /* @__PURE__ */ jsx(KV, { label: "Version", value: hostInfo?.version ?? "unknown" })
          ] }),
          /* @__PURE__ */ jsx(Section, { title: "Capabilities", children: /* @__PURE__ */ jsx("pre", { className: "text-[10px] leading-relaxed font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all max-h-32 overflow-y-auto", children: hostCapabilities ? JSON.stringify(hostCapabilities, null, 2) : "none" }) }),
          /* @__PURE__ */ jsxs(Section, { title: "Locale", children: [
            /* @__PURE__ */ jsx(
              KV,
              {
                label: "Value",
                value: /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold", children: locale || "not set" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 uppercase tracking-wider font-semibold", children: "Formatted Numbers" }),
              formattedNumbers.map((n) => /* @__PURE__ */ jsx(KV, { label: String(n.raw), value: n.formatted }, n.raw))
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 uppercase tracking-wider font-semibold", children: "Formatted Dates" }),
              formattedDates.map((d) => /* @__PURE__ */ jsxs("div", { className: "py-0.5", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 font-mono truncate", children: d.raw }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-800 dark:text-gray-200", children: d.formatted })
              ] }, d.raw))
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Section, { title: "Timezone", children: [
            /* @__PURE__ */ jsx(
              KV,
              {
                label: "Value",
                value: /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold", children: timeZone || "not set" })
              }
            ),
            /* @__PURE__ */ jsx(KV, { label: "Server time", value: props?.timestamp })
          ] }),
          /* @__PURE__ */ jsx(Section, { title: "User Agent", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-mono text-gray-600 dark:text-gray-400 break-all leading-relaxed", children: userAgent ? String(userAgent) : "not available" }) }),
          /* @__PURE__ */ jsx(Section, { title: "Safe Area", children: safeArea ? /* @__PURE__ */ jsx(SafeAreaBox, { safeArea }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "not provided" }) }),
          /* @__PURE__ */ jsxs(Section, { title: "Layout", children: [
            /* @__PURE__ */ jsx(
              KV,
              {
                label: "Max width",
                value: maxWidth != null ? `${maxWidth}px` : "\u2014"
              }
            ),
            /* @__PURE__ */ jsx(
              KV,
              {
                label: "Max height",
                value: maxHeight != null ? `${maxHeight}px` : "\u2014"
              }
            ),
            /* @__PURE__ */ jsx(KV, { label: "Grid cols", value: gridCols })
          ] }),
          /* @__PURE__ */ jsxs(Section, { title: "Display", children: [
            /* @__PURE__ */ jsx(KV, { label: "Mode", value: displayMode || "\u2014" }),
            /* @__PURE__ */ jsx(
              KV,
              {
                label: "Theme",
                value: /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `px-1.5 py-0.5 rounded text-xs font-medium ${theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"}`,
                    children: theme || "\u2014"
                  }
                )
              }
            )
          ] }),
          output && /* @__PURE__ */ jsx(Section, { title: "Output", children: /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: typeof output === "string" ? /* @__PURE__ */ jsx("p", { children: output }) : /* @__PURE__ */ jsx("pre", { className: "font-mono whitespace-pre-wrap", children: JSON.stringify(output, null, 2) }) }) })
        ]
      }
    )
  ] }) });
};
var widget_default = ContextDisplay;

// .mcp-use/context-display/entry.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var container = document.getElementById("widget-root");
if (container && widget_default) {
  const root = createRoot(container);
  root.render(/* @__PURE__ */ jsx2(widget_default, {}));
}
//# sourceMappingURL=entry.js.map
