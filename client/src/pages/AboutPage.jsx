import { Link } from "react-router-dom";

const coreValues = [
  {
    title: "Compassion first",
    description:
      "Every interaction is grounded in empathy. Breaking a habit is hard—our product language, reminders, and insights aim to soften the process, not shame it.",
  },
  {
    title: "Progress over perfection",
    description:
    "Lapses are data, not failure. BeFree helps you notice what triggered the moment and how you can respond differently next time.",
  },
  {
    title: "Privacy respected",
    description:
      "Your journey is yours. Authentication, data storage, and logging are built with privacy in mind so you can be honest with yourself.",
  },
];

const pillars = [
  {
    emoji: "🪴",
    title: "Daily intention",
    text: "Set a realistic goal each morning and mark how the day went in the evening. Small check-ins compound into big wins.",
  },
  {
    emoji: "💡",
    title: "Gentle insights",
    text: "Spot patterns around cravings, moods, and environments. Use those insights to adjust your plan without judgment.",
  },
  {
    emoji: "🎉",
    title: "Celebrate milestones",
    text: "A streak counter alone is not enough. We surface meaningful achievements and invite you to honour them—no matter the size.",
  },
];

export default function AboutPage() {
  return (
    <div className="page">
      <section className="glass-panel">
        <span className="badge">Our intention</span>
        <h1 className="title">A kinder companion for change</h1>
        <p className="subtitle">
          BeFree exists to support anyone reducing or quitting an addictive
          habit—drinks, cigarettes, doom scrolling, or anything else that no
          longer serves you.
        </p>

        <div className="values-grid">
          {coreValues.map((value) => (
            <article key={value.title} className="value-card">
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pillars glass-panel">
        <h2 className="title">What makes BeFree different?</h2>
        <div className="pillars-grid">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="pillar-card">
              <div className="pillar-icon" aria-hidden="true">
                {pillar.emoji}
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
        <div className="actions">
          <Link className="btn btn-primary" to="/signup">
            Create your account
          </Link>
          <Link className="btn" to="/resources">
            Explore resources
          </Link>
        </div>
      </section>
    </div>
  );
}
