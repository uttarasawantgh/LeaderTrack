const QUOTES = [
  // Navigating Change — Ralph Nader
  '"The function of leadership is to produce more leaders, not more followers." — Ralph Nader, Navigating Change',
  '"There are no great limits to growth because there are no limits of human intelligence, imagination, and wonder." — Ralph Nader, Navigating Change',
  '"The most important office in a democracy is the office of citizen." — Ralph Nader, Navigating Change',
  '"A society that has more justice is a society that needs less charity." — Ralph Nader, Navigating Change',
  '"Change is not something to be feared; it is something to be navigated with purpose." — Ralph Nader, Navigating Change',

  // Ethicability — Roger Steare
  '"Integrity means doing the right thing because it is the right thing to do." — Roger Steare, Ethicability',
  '"Ethics is not about being perfect. It is about trying to be good." — Roger Steare, Ethicability',
  '"Trust is built through consistent, ethical behaviour over time." — Roger Steare, Ethicability',
  '"Character is what we do when we think no one is watching." — Roger Steare, Ethicability',
  '"An ethical decision balances heart, mind, and courage." — Roger Steare, Ethicability',
];

function getTodayQuote(): string {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

export default function QuoteBanner() {
  const quote = getTodayQuote();

  return (
    <div className="mb-6 px-4 py-3 rounded-xl bg-bg-card border border-border-subtle">
      <p className="text-sm italic text-accent-gold leading-relaxed text-center">
        {quote}
      </p>
    </div>
  );
}