import Header from "./components/Header";
import QuoteBanner from "./components/QuoteBanner";
import BookCard from "./components/BookCard";
import QuickLogForm from "./components/QuickLogForm";
import BedtimeWidget from "./components/BedtimeWidget";
import WisdomFeed from "./components/WisdomFeed";
import { useAppContext } from "./context/AppContext";
import { calculateStreak } from "./utils/streak";
import { usePause } from "./hooks/usePause";

export default function App() {
  const { data } = useAppContext();
  const { paused, togglePause } = usePause();
  const streak = calculateStreak(data.sessions, paused);

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
        </section>

        {/* Bedtime Grounding */}
        <BedtimeWidget />

        {/* Quick-Log Form */}
        <QuickLogForm />

        {/* Wisdom Feed */}
        <WisdomFeed />
      </div>
    </div>
  );
}