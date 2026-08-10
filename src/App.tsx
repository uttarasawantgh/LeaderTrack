import { useState } from "react";
import Header from "./components/Header";
import QuoteBanner from "./components/QuoteBanner";
import BookCard from "./components/BookCard";
import QuickLogForm from "./components/QuickLogForm";
import BedtimeWidget from "./components/BedtimeWidget";
import WisdomFeed from "./components/WisdomFeed";
import AddBookForm from "./components/AddBookForm";
import { useAppContext } from "./context/AppContext";
import { calculateStreak } from "./utils/streak";
import { usePause } from "./hooks/usePause";

export default function App() {
  const { data } = useAppContext();
  const { paused, togglePause } = usePause();
  const streak = calculateStreak(data.sessions, paused);
  const [addBookOpen, setAddBookOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="mx-auto max-w-[480px] px-4 py-6">
        <Header streak={streak} paused={paused} onTogglePause={togglePause} />

        <QuoteBanner />

        {/* Book Cards */}
        <section className="mb-6 space-y-3">
          {data.books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}

          {/* Add Book Button */}
          <button
            type="button"
            onClick={() => setAddBookOpen(true)}
            className="w-full rounded-xl border-2 border-dashed border-border-subtle p-4 text-sm text-text-secondary
              transition-all duration-150 ease-out hover:border-accent-gold/40 hover:text-accent-gold
              active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            <span>Add Another Book</span>
          </button>
        </section>

        {/* Bedtime Grounding */}
        <BedtimeWidget />

        {/* Quick-Log Form */}
        <QuickLogForm />

        {/* Wisdom Feed */}
        <WisdomFeed />
      </div>

      {/* Add Book Modal */}
      <AddBookForm open={addBookOpen} onClose={() => setAddBookOpen(false)} />
    </div>
  );
}