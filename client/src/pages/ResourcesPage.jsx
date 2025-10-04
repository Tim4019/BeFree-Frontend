const helplines = [
  {
    region: "United States",
    number: "1-800-662-4357",
    description: "SAMHSA’s National Helpline (24/7 confidential treatment referrals)",
  },
  {
    region: "Canada",
    number: "1-833-456-4566",
    description: "Talk Suicide Canada (24/7)",
  },
  {
    region: "United Kingdom",
    number: "116 123",
    description: "Samaritans (free confidential emotional support)",
  },
  {
    region: "Australia",
    number: "13 11 14",
    description: "Lifeline Australia (crisis support and suicide prevention)",
  },
];

const readingList = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    insight: "A blueprint for tiny changes that deliver remarkable results—great for stacking new, healthier routines.",
  },
  {
    title: "The Unexpected Joy of Being Sober",
    author: "Catherine Gray",
    insight: "A candid memoir full of reframes that make an alcohol-free life feel expansive rather than restrictive.",
  },
  {
    title: "Dopamine Nation",
    author: "Dr. Anna Lembke",
    insight: "Explores the science of compulsive behaviour and offers strategies to recalibrate the brain’s reward system.",
  },
];

const practices = [
  {
    emoji: "📝",
    title: "Urge surfing journal",
    description:
      "Name the trigger, rate the intensity, set a timer for 10 minutes, and breathe through the wave—rate again afterwards.",
  },
  {
    emoji: "🌬️",
    title: "Box breathing",
    description:
      "Inhale for four, hold for four, exhale for four, hold for four. Repeat 5–8 cycles whenever cravings spike.",
  },
  {
    emoji: "📱",
    title: "SOS contact list",
    description:
      "Keep three people saved under favourites with a short encouragement script so reaching out feels easier in the moment.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="page">
      <section className="glass-panel">
        <span className="badge">Quick help</span>
        <h1 className="title">Recovery resources</h1>
        <p className="subtitle">
          Save these numbers, practices, and reads. Share them with a friend who
          might need a boost too.
        </p>

        <div className="helpline-grid">
          {helplines.map((line) => (
            <article key={line.region} className="helpline-card">
              <h3>{line.region}</h3>
              <p className="helpline-number">{line.number}</p>
              <p>{line.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel reading">
        <h2 className="title">Reading that offers perspective</h2>
        <div className="reading-grid">
          {readingList.map((book) => (
            <article key={book.title} className="reading-card">
              <h3>{book.title}</h3>
              <p className="muted">{book.author}</p>
              <p>{book.insight}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel">
        <h2 className="title">Grounding practices</h2>
        <div className="practices-grid">
          {practices.map((practice) => (
            <article key={practice.title} className="practice-card">
              <div className="practice-icon" aria-hidden="true">
                {practice.emoji}
              </div>
              <div>
                <h3>{practice.title}</h3>
                <p>{practice.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
