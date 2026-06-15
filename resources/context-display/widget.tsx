import {
  McpUseProvider,
  useWidget,
  type WidgetMetadata,
} from "mcp-use/react";
import React, { useMemo } from "react";
import "../styles.css";
import { propSchema, type ContextDisplayProps } from "./types";

export const widgetMetadata: WidgetMetadata = {
  description: "Host context inspector — locale, timezone, layout, device",
  props: propSchema,
  exposeAsTool: false,
  metadata: {
    prefersBorder: true,
    invoking: "Detecting context…",
    invoked: "Context ready",
  },
};

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${
        active ? "bg-emerald-500" : "bg-red-500"
      }`}
    />
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100">
        {children}
      </div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
        {label}
      </span>
      <span className="text-xs font-mono text-gray-800 dark:text-gray-200 text-right truncate">
        {value ?? "—"}
      </span>
    </div>
  );
}

function SafeAreaBox({
  safeArea,
}: {
  safeArea: { insets?: { top: number; right: number; bottom: number; left: number } };
}) {
  const insets = safeArea.insets ?? { top: 0, right: 0, bottom: 0, left: 0 };
  return (
    <div className="relative w-full h-28 rounded border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] text-gray-400 dark:text-gray-500">
      <span className="absolute top-1 left-1/2 -translate-x-1/2 font-mono">
        {insets.top}
      </span>
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono">
        {insets.bottom}
      </span>
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 font-mono">
        {insets.left}
      </span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 font-mono">
        {insets.right}
      </span>
      <div
        className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded"
        style={{
          position: "absolute",
          top: `${insets.top}px`,
          right: `${insets.right}px`,
          bottom: `${insets.bottom}px`,
          left: `${insets.left}px`,
          minWidth: 20,
          minHeight: 20,
        }}
      />
      <span className="z-10 text-gray-400 dark:text-gray-500">safe area</span>
    </div>
  );
}

const ContextDisplay: React.FC = () => {
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
    displayMode,
  } = useWidget<ContextDisplayProps>();

  const gridCols = useMemo(() => {
    if (!maxWidth || maxWidth < 400) return 1;
    if (maxWidth < 800) return 2;
    return 3;
  }, [maxWidth]);

  const formattedNumbers = useMemo(() => {
    if (!props?.sampleNumbers) return [];
    try {
      const fmt = new Intl.NumberFormat(locale || undefined);
      return props.sampleNumbers.map((n) => ({
        raw: n,
        formatted: fmt.format(n),
      }));
    } catch {
      return props.sampleNumbers.map((n) => ({
        raw: n,
        formatted: String(n),
      }));
    }
  }, [props?.sampleNumbers, locale]);

  const formattedDates = useMemo(() => {
    if (!props?.sampleDates) return [];
    try {
      const fmt = new Intl.DateTimeFormat(locale || undefined, {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: timeZone || undefined,
      });
      return props.sampleDates.map((d) => ({
        raw: d,
        formatted: fmt.format(new Date(d)),
      }));
    } catch {
      return props.sampleDates.map((d) => ({ raw: d, formatted: d }));
    }
  }, [props?.sampleDates, locale, timeZone]);

  if (isPending) {
    return (
      <McpUseProvider autoSize>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Detecting host context…
            </span>
          </div>
        </div>
      </McpUseProvider>
    );
  }

  return (
    <McpUseProvider autoSize>
      <div className="p-4">
        <div className="flex items-center gap-2.5 mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Host Context Inspector
          </h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {props?.greeting}
          </span>
        </div>

        <div
          className="gap-3"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          }}
        >
          {/* Connection */}
          <Section title="Connection">
            <div className="flex items-center gap-2">
              <StatusDot active={!!isAvailable} />
              <span className="text-xs">
                {isAvailable ? "Connected" : "Disconnected"}
              </span>
            </div>
          </Section>

          {/* Host */}
          <Section title="Host">
            <KV label="Name" value={hostInfo?.name ?? "unknown"} />
            <KV label="Version" value={hostInfo?.version ?? "unknown"} />
          </Section>

          {/* Capabilities */}
          <Section title="Capabilities">
            <pre className="text-[10px] leading-relaxed font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
              {hostCapabilities
                ? JSON.stringify(hostCapabilities, null, 2)
                : "none"}
            </pre>
          </Section>

          {/* Locale */}
          <Section title="Locale">
            <KV
              label="Value"
              value={
                <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold">
                  {locale || "not set"}
                </span>
              }
            />
            <div className="mt-2 space-y-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                Formatted Numbers
              </p>
              {formattedNumbers.map((n) => (
                <KV key={n.raw} label={String(n.raw)} value={n.formatted} />
              ))}
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                Formatted Dates
              </p>
              {formattedDates.map((d) => (
                <div key={d.raw} className="py-0.5">
                  <p className="text-[10px] text-gray-400 font-mono truncate">
                    {d.raw}
                  </p>
                  <p className="text-xs text-gray-800 dark:text-gray-200">
                    {d.formatted}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* Timezone */}
          <Section title="Timezone">
            <KV
              label="Value"
              value={
                <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold">
                  {timeZone || "not set"}
                </span>
              }
            />
            <KV label="Server time" value={props?.timestamp} />
          </Section>

          {/* User Agent */}
          <Section title="User Agent">
            <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all leading-relaxed">
              {userAgent ? String(userAgent) : "not available"}
            </p>
          </Section>

          {/* Safe Area */}
          <Section title="Safe Area">
            {safeArea ? (
              <SafeAreaBox safeArea={safeArea} />
            ) : (
              <p className="text-xs text-gray-400">not provided</p>
            )}
          </Section>

          {/* Layout */}
          <Section title="Layout">
            <KV
              label="Max width"
              value={maxWidth != null ? `${maxWidth}px` : "—"}
            />
            <KV
              label="Max height"
              value={maxHeight != null ? `${maxHeight}px` : "—"}
            />
            <KV label="Grid cols" value={gridCols} />
          </Section>

          {/* Display */}
          <Section title="Display">
            <KV label="Mode" value={displayMode || "—"} />
            <KV
              label="Theme"
              value={
                <span
                  className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {theme || "—"}
                </span>
              }
            />
          </Section>

          {/* Output */}
          {output && (
            <Section title="Output">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {typeof output === "string" ? (
                  <p>{output}</p>
                ) : (
                  <pre className="font-mono whitespace-pre-wrap">
                    {JSON.stringify(output, null, 2)}
                  </pre>
                )}
              </div>
            </Section>
          )}
        </div>
      </div>
    </McpUseProvider>
  );
};

export default ContextDisplay;
