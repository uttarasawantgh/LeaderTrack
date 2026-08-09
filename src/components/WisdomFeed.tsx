import { useAppContext } from "../context/AppContext";
import FeedItem from "./FeedItem";

export default function WisdomFeed() {
  const { data } = useAppContext();

  // Sort sessions: newest first
  const sortedSessions = [...data.sessions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <section className="mb-8">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-text-primary">
          🧠 Wisdom Feed
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Your reading journey, captured.
        </p>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl bg-bg-card border border-border-subtle">
          <span
            className="text-4xl mb-3 animate-pulse-soft"
            role="img"
            aria-label="book"
          >
            📖
          </span>
          <h3 className="text-sm font-medium text-text-primary mb-1">
            No sessions logged yet
          </h3>
          <p className="text-xs text-text-secondary text-center max-w-[220px]">
            Start your reading journey by logging your first session above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSessions.map((session) => (
            <FeedItem key={session.id} session={session} />
          ))}
        </div>
      )}
    </section>
  );
}