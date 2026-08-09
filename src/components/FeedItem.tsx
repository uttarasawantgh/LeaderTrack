import { useState } from "react";
import type { SessionLog } from "../types";

interface FeedItemProps {
  session: SessionLog;
}

const BOOK_ABBREVIATIONS: Record<string, string> = {
  "navigating-change": "NC",
  ethicability: "Eth",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function FeedItem({ session }: FeedItemProps) {
  const [expanded, setExpanded] = useState(false);
  const hasTakeaway = session.takeaway.length > 0;
  const hasQuote = session.quote.length > 0;
  const hasWarning = session.warning.length > 0;

  const hasAnyContent = hasTakeaway || hasQuote || hasWarning;
  const needsTruncation = !expanded && hasAnyContent;

  return (
    <div
      className="rounded-xl bg-bg-card border border-border-subtle p-4 transition-all duration-150 hover:translate-y-[-1px] hover:bg-bg-card-hover cursor-default"
      onClick={() => {
        if (hasAnyContent) setExpanded((prev) => !prev);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (hasAnyContent) setExpanded((prev) => !prev);
        }
      }}
      aria-expanded={expanded}
    >
      {/* Top row: date, book pill, time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary tabular-nums">
            {formatDate(session.date)}
          </span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-bg-base text-accent-gold/90 border border-accent-gold/20">
            {BOOK_ABBREVIATIONS[session.bookId] ?? session.bookId}
          </span>
        </div>
        <span className="text-xs text-text-secondary tabular-nums">
          ⏱ {session.timeInvested}m
        </span>
      </div>

      {/* Icons row */}
      <div className="flex items-center gap-2 mb-2">
        {hasTakeaway && <span className="text-sm" title="Takeaway">💡</span>}
        {hasQuote && <span className="text-sm" title="Quote">✨</span>}
        {hasWarning && <span className="text-sm" title="Warning">⚠️</span>}
        {session.bedtimeReading && <span className="text-sm" title="Evening reading">🌙</span>}
      </div>

      {/* Content */}
      {hasAnyContent && (
        <div
          className={`
            text-sm text-text-primary leading-relaxed mb-2
            ${needsTruncation ? "line-clamp-2" : ""}
            transition-all duration-200
          `}
        >
          {hasTakeaway && (
            <p className="mb-1">
              <span className="font-medium">💡</span> {session.takeaway}
            </p>
          )}
          {hasQuote && (
            <p className="mb-1 italic text-accent-gold/90">
              <span className="not-italic font-medium">✨</span> "{session.quote}"
            </p>
          )}
          {hasWarning && (
            <p className="mb-1">
              <span className="font-medium">⚠️</span> {session.warning}
            </p>
          )}

          {/* Expand/collapse toggle */}
          {hasAnyContent && (
            <button
              type="button"
              className="text-xs text-accent-gold/70 hover:text-accent-gold mt-1 cursor-pointer transition-colors duration-150"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((prev) => !prev);
              }}
            >
              {expanded ? "Show less ▲" : "... read more"}
            </button>
          )}
        </div>
      )}

      {/* Bedtime-only entries - simple message */}
      {!hasAnyContent && session.bedtimeReading && (
        <p className="text-xs text-text-secondary italic mb-2">
          Evening reading session 🌙
        </p>
      )}

      {/* Bottom: pages read */}
      {session.pagesRead > 0 && (
        <div className="flex justify-end">
          <span className="text-xs text-text-secondary tabular-nums">
            📖 +{session.pagesRead} pages
          </span>
        </div>
      )}
    </div>
  );
}