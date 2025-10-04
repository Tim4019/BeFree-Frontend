import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext.js";
import { useThemeContext } from "../context/useThemeContext.js";

const DAWN_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
];

const DUSK_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1520013124535-0b6b1f5f0597?auto=format&fit=crop&w=1600&q=80",
];

export default function HomePage() {
  const { user } = useAuthContext();
  const { theme } = useThemeContext();
  // Motivational quotes
  const quotes = [
    "One day at a time.",
    "Small steps every day lead to big change.",
    "Your journey is your strength.",
    "Recovery is progress, not perfection.",
    "Believe you can and you're halfway there.",
    "Every step forward is a step toward success.",
    "Recovery is not a race. You don’t have to feel guilty if it takes you longer than you thought it would.",
    "The chains of addiction are too light to be felt until they are too heavy to be broken — break them while you can.",
    "Your future needs you. Your past does not.",
    "Don’t let the substance define you. Let your strength redefine you.",
    "Each day is a new chance to build the life you deserve.",
    "Healing doesn’t mean the damage never existed. It means it no longer controls your life.",
    "Recovery is hard, but regret is harder.",
    "You are allowed to be both a masterpiece and a work in progress.",
    "Addiction is giving up everything for one thing. Recovery is giving up one thing for everything.",
    "Be stronger than your strongest excuse.",
    "Rock bottom became the solid foundation on which I rebuilt my life.",
    "The comeback is always stronger than the setback.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const randomImage = useMemo(() => {
    const list = theme === "dusk" ? DUSK_HERO_IMAGES : DAWN_HERO_IMAGES;
    return list[Math.floor(Math.random() * list.length)];
  }, [theme]);

  return (
    <div className="page page-home">
      <section className="hero">
        <img src={randomImage} alt="Calm background" className="hero-img" />
        <div className="hero-overlay">
          <span className="badge">Your recovery companion</span>
          <h1 className="hero-title">BFree</h1>
          <p className="hero-subtitle">
            A gentle space to log progress, celebrate milestones, and stay
            connected to your "why" while you reduce or quit any addiction.
          </p>
          <div className="actions">
            {!user ? (
              <>
                <Link className="btn btn-primary" to="/signup">
                  Start your journey
                </Link>
                <Link className="btn btn-ghost hero-link" to="/login">
                  I already have an account
                </Link>
              </>
            ) : (
              <>
                <Link className="btn btn-primary" to="/profile">
                  Go to dashboard
                </Link>
                <Link className="btn btn-ghost hero-link" to="/settings">
                  Personalise settings
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="glass-panel">
        <p className="quote">“{randomQuote}”</p>
      </section>

      <section className="support-grid">
        <article className="support-card">
          <div className="support-icon" aria-hidden="true">🧭</div>
          <h3>Daily clarity</h3>
          <p>
            Check in each day, reflect on your mood, and spot patterns that
            strengthen your commitment to change.
          </p>
        </article>
        <article className="support-card">
          <div className="support-icon" aria-hidden="true">🎯</div>
          <h3>Milestones that matter</h3>
          <p>
            Celebrate meaningful wins—whether that is one day less, a week
            clean, or a personal breakthrough worth sharing.
          </p>
        </article>
        <article className="support-card">
          <div className="support-icon" aria-hidden="true">🤝</div>
          <h3>Always on your side</h3>
          <p>
            Secure authentication keeps your story private while keeping your
            tools close on any device.
          </p>
        </article>
      </section>

      <section className="glass-panel journey">
        <h2 className="title">Ready when you are</h2>
        <p className="subtitle">
          Choose your starting point, track cravings or slips without shame,
          and watch resilience grow.
        </p>
        <div className="actions">
          {!user ? (
            <>
              <Link className="btn btn-primary" to="/signup">
                Create a free account
              </Link>
              <Link className="btn" to="/login">
                Continue logging in
              </Link>
            </>
          ) : (
            <>
              <Link className="btn btn-primary" to="/profile">
                View your journey
              </Link>
              <Link className="btn" to="/profile">
                Review milestones
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
