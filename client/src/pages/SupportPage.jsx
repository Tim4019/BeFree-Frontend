import { Link } from "react-router-dom";

const faq = [
  {
    question: "Do I need to be 100% sober to use BeFree?",
    answer:
      "Not at all. Whether you are cutting down, aiming for moderation, or going fully substance-free, the app adapts to your pace.",
  },
  {
    question: "What if I relapse?",
    answer:
      "Lapses are data. Log the event, note what happened around it, and mark how you want to respond next time. No judgement, just insight.",
  },
  {
    question: "Is my information private?",
    answer:
      "Yes. Your logs stay attached to your account only. Use a strong password, and feel free to log out on shared devices.",
  },
];

const steps = [
  {
    number: "01",
    title: "Set your intention",
    detail: "Choose the habit you’re addressing and personalise your first milestone—maybe ‘3 days mindful drinking’ or ‘1 week smoke-free’.",
  },
  {
    number: "02",
    title: "Check in daily",
    detail: "Record mood, urges, slips, or wins. The more honest the log, the clearer your patterns become.",
  },
  {
    number: "03",
    title: "Review weekly",
    detail: "Glance at your streak, milestones hit, and any notes. Celebrate progress and adjust goals for the coming week.",
  },
];

export default function SupportPage() {
  return (
    <div className="page">
      <section className="glass-panel">
        <span className="badge">Need a hand?</span>
        <h1 className="title">Support & guidance</h1>
        <p className="subtitle">
          Recovery feels lighter when you have a plan. Here’s how to get the most
          out of BeFree, plus answers to common questions.
        </p>

        <div className="steps-grid">
          {steps.map((step) => (
            <article key={step.number} className="step-card">
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel faq">
        <h2 className="title">Frequently asked questions</h2>
        <div className="faq-list">
          {faq.map((item) => (
            <article key={item.question} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
        <div className="actions">
          <Link className="btn btn-primary" to="/signup">
            Start tracking today
          </Link>
          <Link className="btn" to="/contact">
            Contact us (coming soon)
          </Link>
        </div>
      </section>
    </div>
  );
}
