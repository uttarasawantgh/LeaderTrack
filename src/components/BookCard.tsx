import type { Book } from "../types";
import ProgressRing from "./ProgressRing";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="rounded-xl bg-bg-card border border-border-subtle p-4 transition-all duration-150 hover:translate-y-[-1px] hover:bg-bg-card-hover">
      {/* Edition badge + title row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center gap-1 text-xs text-accent-amber mb-1">
            <span>🎁</span>
            <span>Special Edition</span>
          </span>
          <h3 className="text-sm font-semibold text-text-primary truncate">
            {book.title}
          </h3>
        </div>
        <ProgressRing
          current={book.currentPage}
          total={book.totalPages}
          size={72}
          strokeWidth={5}
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-3 text-xs text-text-secondary tabular-nums">
        <span>
          {book.currentPage} / {book.totalPages} pages
        </span>
        <span className="text-accent-gold font-medium">
          {book.totalPages > 0
            ? Math.round((book.currentPage / book.totalPages) * 100)
            : 0}
          %
        </span>
      </div>
    </div>
  );
}