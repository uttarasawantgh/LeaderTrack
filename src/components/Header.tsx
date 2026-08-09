interface HeaderProps {
  streak: number;
  paused: boolean;
  onTogglePause: () => void;
}

export default function Header({ streak, paused, onTogglePause }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <span className="text-xl" role="img" aria-label="fire">
          🔥
        </span>
        <div>
          <h1 className="text-lg font-semibold text-text-primary tracking-wide">
            LeaderTrack
          </h1>
          <p className="text-xs text-text-secondary">
            {paused
              ? "Paused — streak frozen"
              : streak > 0
                ? `${streak}-Day Streak!`
                : "Start your streak today!"}
          </p>
        </div>
      </div>

      <button
        onClick={onTogglePause}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
          transition-all duration-150 ease-out active:scale-95 cursor-pointer
          ${
            paused
              ? "bg-accent-gold/15 text-accent-gold border border-accent-gold/30"
              : "bg-bg-card text-text-secondary border border-border-subtle hover:bg-bg-card-hover"
          }
        `}
        aria-label={paused ? "Resume tracking" : "Pause streak"}
        title={paused ? "Resume tracking" : "Pause streak"}
      >
        <span className="text-xs">{paused ? "▶" : "⏸"}</span>
        <span>{paused ? "Resume" : "Pause"}</span>
      </button>
    </header>
  );
}