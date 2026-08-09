const QUOTES = [
  '"Leadership is not about being in charge. It is about taking care of those in your charge." — Simon Sinek',
  '"The function of leadership is to produce more leaders, not more followers." — Ralph Nader',
  '"A reader lives a thousand lives before he dies. The man who never reads lives only one." — George R.R. Martin',
  '"The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice." — Brian Herbert',
  '"Reading is to the mind what exercise is to the body." — Joseph Addison',
  '"The only thing that you absolutely have to know is the location of the library." — Albert Einstein',
  '"Great leaders are willing to sacrifice their own interests for the good of the team." — John C. Maxwell',
  '"Integrity is doing the right thing, even when no one is watching." — C.S. Lewis',
  '"A leader is one who knows the way, goes the way, and shows the way." — John C. Maxwell',
  '"Reading without reflecting is like eating without digesting." — Edmund Burke',
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