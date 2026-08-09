import { useState } from "react";
import type { BookId, TimeOption } from "../types";
import { useAppContext } from "../context/AppContext";
import { getTodayDate } from "../utils/streak";

const TIME_OPTIONS: TimeOption[] = [15, 30, 45, 60];

export default function QuickLogForm() {
  const { data, actions } = useAppContext();

  const [selectedBook, setSelectedBook] = useState<BookId | "">("");
  const [timeInvested, setTimeInvested] = useState<TimeOption | null>(null);
  const [pagesRead, setPagesRead] = useState("");
  const [takeaway, setTakeaway] = useState("");
  const [quote, setQuote] = useState("");
  const [warning, setWarning] = useState("");
  const [bedtimeReading, setBedtimeReading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pagesNum = parseInt(pagesRead, 10);
  const isValid =
    selectedBook !== "" &&
    timeInvested !== null &&
    pagesRead.trim() !== "" &&
    !isNaN(pagesNum) &&
    pagesNum > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || !selectedBook || !timeInvested) return;

    actions.addSession({
      id: crypto.randomUUID(),
      date: getTodayDate(),
      bookId: selectedBook,
      timeInvested,
      pagesRead: pagesNum,
      takeaway: takeaway.trim(),
      quote: quote.trim(),
      warning: warning.trim(),
      bedtimeReading,
      createdAt: new Date().toISOString(),
    });

    // Reset form
    setSelectedBook("");
    setTimeInvested(null);
    setPagesRead("");
    setTakeaway("");
    setQuote("");
    setWarning("");
    setBedtimeReading(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  }

  return (
    <section className="mb-6">
      <div className="rounded-xl bg-bg-card border border-border-subtle p-4">
        {/* Section heading */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-text-primary">
            📝 Quick Log
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Log a reading session
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Book Selector */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Book
            </label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value as BookId)}
              className="w-full px-3 py-2 rounded-lg bg-bg-base border border-border-subtle text-text-primary text-sm
                focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20
                transition-colors duration-150 appearance-none cursor-pointer"
              aria-label="Select a book"
            >
              <option value="" disabled>
                Select a book...
              </option>
              {data.books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>

          {/* Time Invested Pills */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Time Invested
            </label>
            <div className="flex gap-2">
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeInvested(t)}
                  className={`
                    flex-1 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-150 ease-out active:scale-95 cursor-pointer
                    ${
                      timeInvested === t
                        ? "bg-accent-gold text-black border border-accent-gold"
                        : "bg-bg-base text-text-secondary border border-border-subtle hover:bg-bg-card-hover"
                    }
                  `}
                >
                  {t}m
                </button>
              ))}
            </div>
          </div>

          {/* Pages Read */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Pages Read <span className="text-accent-gold">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={pagesRead}
              onChange={(e) => setPagesRead(e.target.value)}
              placeholder="e.g. 15"
              className="w-full px-3 py-2 rounded-lg bg-bg-base border border-border-subtle text-text-primary text-sm
                focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20
                transition-colors duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Pages read this session"
            />
          </div>

          {/* One Big Takeaway */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              💡 One Big Takeaway
            </label>
            <textarea
              value={takeaway}
              onChange={(e) => setTakeaway(e.target.value)}
              placeholder="What's the key insight from this session?"
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-bg-base border border-border-subtle text-text-primary text-sm
                focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20
                transition-colors duration-150 resize-none"
            />
          </div>

          {/* Chapter Quote (optional) */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              ✨ Chapter Quote <span className="text-text-secondary/60">(optional)</span>
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="A memorable quote or ending nugget..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-bg-base border border-border-subtle text-text-primary text-sm
                focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20
                transition-colors duration-150 resize-none"
            />
          </div>

          {/* Personal Warning (optional) */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              ⚠️ Watch Out For <span className="text-text-secondary/60">(optional)</span>
            </label>
            <textarea
              value={warning}
              onChange={(e) => setWarning(e.target.value)}
              placeholder="A personal warning or caution to remember..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-bg-base border border-border-subtle text-text-primary text-sm
                focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20
                transition-colors duration-150 resize-none"
            />
          </div>

          {/* Bedtime checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center
                transition-all duration-150
                ${
                  bedtimeReading
                    ? "bg-accent-bedtime border-accent-bedtime"
                    : "border-border-subtle bg-bg-base group-hover:border-accent-bedtime/50"
                }
              `}
            >
              {bedtimeReading && (
                <span className="text-white text-xs leading-none">✓</span>
              )}
            </div>
            <input
              type="checkbox"
              checked={bedtimeReading}
              onChange={(e) => setBedtimeReading(e.target.checked)}
              className="sr-only"
            />
            <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors duration-150">
              Read physical book at end of day 🌙
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className={`
              w-full py-2.5 rounded-lg text-sm font-semibold
              transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer
              ${
                submitted
                  ? "bg-success text-white"
                  : isValid
                    ? "bg-accent-gold text-black hover:bg-accent-amber"
                    : "bg-bg-base text-text-secondary/40 border border-border-subtle cursor-not-allowed"
              }
            `}
          >
            {submitted ? "✅ Session Logged!" : "Log Session"}
          </button>
        </form>
      </div>
    </section>
  );
}