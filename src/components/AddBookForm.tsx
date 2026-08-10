import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface AddBookFormProps {
  open: boolean;
  onClose: () => void;
}

export default function AddBookForm({ open, onClose }: AddBookFormProps) {
  const { data, actions } = useAppContext();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const titleInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus first field on open; return focus to the trigger on close
  useEffect(() => {
    if (open) {
      titleInputRef.current?.focus();
    } else {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  // Close on Escape + trap focus inside the dialog
  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = dialog.querySelectorAll<HTMLElement>(
        'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const pagesNum = parseInt(totalPages, 10);
  const isValid =
    title.trim().length > 0 &&
    author.trim().length > 0 &&
    totalPages.trim() !== "" &&
    !isNaN(pagesNum) &&
    pagesNum > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    const id = slugify(title.trim());
    // Check for duplicate id
    if (data.books.some((b) => b.id === id)) {
      setError(`A book with a similar title already exists ("${title.trim()}").`);
      return;
    }

    actions.addBook({
      id,
      title: title.trim(),
      author: author.trim(),
      totalPages: pagesNum,
      currentPage: 0,
    });

    setSubmitted(true);
    setError("");
    setTimeout(() => {
      setSubmitted(false);
      setTitle("");
      setAuthor("");
      setTotalPages("");
      onClose();
    }, 1200);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-book-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet / modal */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-[400px] mx-0 sm:mx-4 rounded-t-2xl sm:rounded-2xl bg-bg-card border border-border-subtle p-5 shadow-xl animate-slide-up"
      >
        {/* Handle bar for mobile */}
        <div className="mx-auto w-10 h-1 rounded-full bg-border-subtle mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 id="add-book-title" className="text-sm font-semibold text-text-primary">
              📚 Add a Book
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Track a new reading companion
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            ref={closeButtonRef}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-bg-base text-text-secondary hover:text-text-primary transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent-gold focus-visible:outline-offset-2"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Book Title <span className="text-accent-gold">*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              placeholder="e.g. Deep Work"
              className="w-full px-3 py-2 rounded-lg bg-bg-base border border-border-subtle text-text-primary text-sm
                focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20
                transition-colors duration-150"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Author <span className="text-accent-gold">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Cal Newport"
              className="w-full px-3 py-2 rounded-lg bg-bg-base border border-border-subtle text-text-primary text-sm
                focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20
                transition-colors duration-150"
            />
          </div>

          {/* Total Pages */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Total Pages <span className="text-accent-gold">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={totalPages}
              onChange={(e) => setTotalPages(e.target.value)}
              placeholder="e.g. 304"
              className="w-full px-3 py-2 rounded-lg bg-bg-base border border-border-subtle text-text-primary text-sm
                focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20
                transition-colors duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400" role="alert">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || submitted}
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
            {submitted ? "✅ Book Added!" : "Add Book"}
          </button>
        </form>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (min-width: 640px) {
          @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}