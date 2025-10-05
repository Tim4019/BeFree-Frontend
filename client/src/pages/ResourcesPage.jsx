import { useEffect, useMemo, useState } from "react";

const helplines = [
  {
    region: "United States",
    number: "1-800-662-4357",
    description:
      "SAMHSA’s National Helpline (24/7 confidential treatment referrals)",
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
    insight:
      "A blueprint for tiny changes that deliver remarkable results—great for stacking new, healthier routines.",
  },
  {
    title: "The Unexpected Joy of Being Sober",
    author: "Catherine Gray",
    insight:
      "A candid memoir full of reframes that make an alcohol-free life feel expansive rather than restrictive.",
  },
  {
    title: "Dopamine Nation",
    author: "Dr. Anna Lembke",
    insight:
      "Explores the science of compulsive behaviour and offers strategies to recalibrate the brain’s reward system.",
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

const HELPLINE_STORAGE_KEY = "bfree-fav-helplines";
const PRACTICE_STORAGE_KEY = "bfree-fav-practices";
const CRISIS_PLAN_STORAGE_KEY = "bfree-crisis-plan";
const TIMER_STORAGE_KEY = "bfree-breath-duration";

const DURATION_OPTIONS = [
  { minutes: 2, label: "2 min reset" },
  { minutes: 5, label: "5 min steady" },
  { minutes: 10, label: "10 min deep" },
];

const defaultPlan = {
  motivation: "",
  warningSigns: "",
  copingMoves: "",
  supporters: "",
  safeSpaces: "",
};

function loadStoredList(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`Could not parse stored list for ${key}`, error);
    return [];
  }
}

function loadStoredPlan() {
  if (typeof window === "undefined") return { ...defaultPlan };
  try {
    const raw = window.localStorage.getItem(CRISIS_PLAN_STORAGE_KEY);
    if (!raw) return { ...defaultPlan };
    const parsed = JSON.parse(raw);
    return { ...defaultPlan, ...parsed };
  } catch (error) {
    console.warn("Could not parse crisis plan", error);
    return { ...defaultPlan };
  }
}

function resolveInitialDuration() {
  if (typeof window === "undefined") return 5;
  const raw = window.localStorage.getItem(TIMER_STORAGE_KEY);
  const parsed = Number(raw);
  const valid = DURATION_OPTIONS.some((option) => option.minutes === parsed);
  return valid ? parsed : 5;
}

function BreathingTimer() {
  const [duration, setDuration] = useState(() => resolveInitialDuration());
  const totalSeconds = duration * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setRunning(false);
  }, [totalSeconds]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    window.localStorage.setItem(TIMER_STORAGE_KEY, String(duration));
    return undefined;
  }, [duration]);

  useEffect(() => {
    if (!running) return undefined;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return totalSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running, totalSeconds]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const progress = Math.round(
    ((totalSeconds - secondsLeft) / totalSeconds) * 100
  );

  return (
    <div className="timer-card">
      <div className="timer-presets" role="group" aria-label="Breathing durations">
        {DURATION_OPTIONS.map((option) => {
          const active = option.minutes === duration;
          return (
            <button
              key={option.minutes}
              type="button"
              className={`btn timer-preset${active ? " active" : ""}`}
              onClick={() => {
                setDuration(option.minutes);
                setRunning(false);
                setSecondsLeft(option.minutes * 60);
              }}
              aria-pressed={active}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="timer-display" aria-live="polite">
        {minutes}:{seconds}
      </div>
      <div className="timer-progress">
        <div className="timer-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="timer-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setRunning((prev) => !prev)}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setRunning(false);
            setSecondsLeft(totalSeconds);
          }}
        >
          Reset
        </button>
      </div>
      <p className="muted timer-hint">
        Breathe in for four, hold for four, exhale for four, hold for four. Repeat until the timer resets.
      </p>
    </div>
  );
}

export default function ResourcesPage() {
  const [favoriteHelplines, setFavoriteHelplines] = useState(() =>
    loadStoredList(HELPLINE_STORAGE_KEY)
  );
  const [favoritePractices, setFavoritePractices] = useState(() =>
    loadStoredList(PRACTICE_STORAGE_KEY)
  );
  const [plan, setPlan] = useState(() => loadStoredPlan());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      HELPLINE_STORAGE_KEY,
      JSON.stringify(favoriteHelplines)
    );
  }, [favoriteHelplines]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      PRACTICE_STORAGE_KEY,
      JSON.stringify(favoritePractices)
    );
  }, [favoritePractices]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CRISIS_PLAN_STORAGE_KEY, JSON.stringify(plan));
  }, [plan]);

  const pinnedHelplines = useMemo(
    () => helplines.filter((line) => favoriteHelplines.includes(line.region)),
    [favoriteHelplines]
  );

  const pinnedPractices = useMemo(
    () => practices.filter((item) => favoritePractices.includes(item.title)),
    [favoritePractices]
  );

  const toggleHelpline = (region) => {
    setFavoriteHelplines((prev) =>
      prev.includes(region)
        ? prev.filter((item) => item !== region)
        : [...prev, region]
    );
  };

  const togglePractice = (title) => {
    setFavoritePractices((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const updatePlanField = (field, value) => {
    setPlan((prev) => ({ ...prev, [field]: value }));
  };

  const resetPlan = () => {
    setPlan({ ...defaultPlan });
  };

  const handlePrintPlan = () => {
    window.print();
  };

  return (
    <div className="page">
      <section className="glass-panel">
        <span className="badge">Quick help</span>
        <h1 className="title">Recovery resources</h1>
        <p className="subtitle">
          Pin the tools you lean on, keep a crisis plan handy, and practise a guided reset in five minutes.
        </p>

        {pinnedHelplines.length + pinnedPractices.length > 0 && (
          <div className="favorites-card">
            <h2>Pinned favourites</h2>
            <ul className="favorites-list">
              {pinnedHelplines.map((line) => (
                <li key={`fav-${line.region}`}>
                  {line.region}: {line.number}
                </li>
              ))}
              {pinnedPractices.map((practice) => (
                <li key={`fav-${practice.title}`}>
                  {practice.title}
                </li>
              ))}
            </ul>
            <p className="muted">
              Your selections stay on this device so they are ready when you need them.
            </p>
          </div>
        )}

        <div className="helpline-grid">
          {helplines.map((line) => {
            const pinned = favoriteHelplines.includes(line.region);
            return (
              <article
                key={line.region}
                className={`helpline-card${pinned ? " helpline-card--pinned" : ""}`}
              >
                <div className="helpline-card-header">
                  <h3>{line.region}</h3>
                  <button
                    type="button"
                    className={`btn btn-ghost helpline-pin${pinned ? " active" : ""}`}
                    onClick={() => toggleHelpline(line.region)}
                    aria-pressed={pinned}
                  >
                    {pinned ? "Pinned" : "Pin"}
                  </button>
                </div>
                <p className="helpline-number">{line.number}</p>
                <p>{line.description}</p>
              </article>
            );
          })}
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
          {practices.map((practice) => {
            const pinned = favoritePractices.includes(practice.title);
            return (
              <article
                key={practice.title}
                className={`practice-card${pinned ? " practice-card--pinned" : ""}`}
              >
                <div className="practice-icon" aria-hidden="true">
                  {practice.emoji}
                </div>
                <div className="practice-body">
                  <div className="practice-header">
                    <h3>{practice.title}</h3>
                    <button
                      type="button"
                      className={`btn btn-ghost practice-pin${pinned ? " active" : ""}`}
                      onClick={() => togglePractice(practice.title)}
                      aria-pressed={pinned}
                    >
                      {pinned ? "Pinned" : "Pin"}
                    </button>
                  </div>
                  <p>{practice.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="glass-panel crisis-plan">
        <h2 className="title">Personal crisis plan</h2>
        <p className="subtitle">
          Fill in the prompts so you can print or save a copy. Keep it somewhere easy to reach.
        </p>

        <div className="crisis-grid">
          <label className="label">
            <span className="label-text">Why staying on track matters to me</span>
            <textarea
              className="input textarea"
              rows="3"
              value={plan.motivation}
              onChange={(event) => updatePlanField("motivation", event.target.value)}
            />
          </label>
          <label className="label">
            <span className="label-text">Warning signs I notice</span>
            <textarea
              className="input textarea"
              rows="3"
              value={plan.warningSigns}
              onChange={(event) => updatePlanField("warningSigns", event.target.value)}
            />
          </label>
          <label className="label">
            <span className="label-text">Coping moves that help</span>
            <textarea
              className="input textarea"
              rows="3"
              value={plan.copingMoves}
              onChange={(event) => updatePlanField("copingMoves", event.target.value)}
            />
          </label>
          <label className="label">
            <span className="label-text">People I can reach out to</span>
            <textarea
              className="input textarea"
              rows="3"
              value={plan.supporters}
              onChange={(event) => updatePlanField("supporters", event.target.value)}
            />
          </label>
          <label className="label">
            <span className="label-text">Places or routines that keep me safe</span>
            <textarea
              className="input textarea"
              rows="3"
              value={plan.safeSpaces}
              onChange={(event) => updatePlanField("safeSpaces", event.target.value)}
            />
          </label>
        </div>

        {(pinnedHelplines.length > 0 || pinnedPractices.length > 0) && (
          <div className="plan-pins">
            {pinnedHelplines.length > 0 && (
              <div>
                <h3>Pinned helplines</h3>
                <ul>
                  {pinnedHelplines.map((line) => (
                    <li key={`plan-${line.region}`}>
                      {line.region}: {line.number}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pinnedPractices.length > 0 && (
              <div>
                <h3>Pinned practices</h3>
                <ul>
                  {pinnedPractices.map((practice) => (
                    <li key={`plan-${practice.title}`}>{practice.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="actions">
          <button type="button" className="btn" onClick={resetPlan}>
            Reset fields
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrintPlan}>
            Print or save plan
          </button>
        </div>
      </section>

      <section className="glass-panel breathing-section">
        <h2 className="title">Five-minute breathing timer</h2>
        <p className="subtitle">
          Press start, follow the breathing rhythm, and let the timer reset when the five minutes are up.
        </p>
        <BreathingTimer />
      </section>
    </div>
  );
}
