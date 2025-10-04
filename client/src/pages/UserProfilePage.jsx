import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext.js";
import JourneyTracker from "../components/JourneyTracker.jsx";

export default function UserProfilePage() {
  const { user, logout } = useAuthContext();

  const stats = useMemo(() => {
    if (!user) return { soberDays: null, memberSince: null };

    const quitDate = user.quitDate ? new Date(user.quitDate) : null;
    const createdAt = user.createdAt ? new Date(user.createdAt) : null;

    const soberDays = quitDate
      ? Math.max(
          1,
          Math.floor(
            (Date.now() - new Date(quitDate).setHours(0, 0, 0, 0)) /
              (1000 * 60 * 60 * 24)
          )
        )
      : null;

    const memberSince = createdAt
      ? createdAt.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

    return { soberDays, memberSince, quitDate };
  }, [user]);

  const accountDetails = [
    { label: "Name", value: user?.name || "-" },
    { label: "Email", value: user?.email || "-" },
    { label: "Primary focus", value: user?.addictionType || "Not set" },
    {
      label: "Quit date",
      value: stats.quitDate
        ? new Date(stats.quitDate).toLocaleDateString()
        : "Let's choose one",
    },
  ];

  const nextSteps = [
    {
      title: "Update milestones",
      copy: "Define the wins you want to celebrate next: 3-day resets, weekly check-ins, or a month badge.",
      action: { label: "View guidance", to: "/support" },
    },
    {
      title: "Journal today's note",
      copy: "Capture a few lines about cravings, mood, or a highlight so you can spot trends later on.",
      action: null,
    },
    {
      title: "Refresh resources",
      copy: "Bookmark helplines and practices you trust so you’re not scrambling when you need them.",
      action: { label: "Browse resources", to: "/resources" },
    },
  ];

  const encouragements = [
    "Consistency beats intensity—aim for honest daily check-ins.",
    "Your future self is grateful for every slip you log and learn from.",
    "Share a milestone with a friend or mentor to reinforce your progress.",
  ];

  return (
    <div className="page page-profile">
      <div className="glass-panel profile-hero">
        <span className="badge">Your space</span>
        <h1 className="title">Hi {user?.name || "there"} 👋</h1>
        <p className="subtitle">
          Track your journey, reflect on wins, and keep your motivation within
          reach.
        </p>

        <div className="profile-stats">
          <article className="profile-stat">
            <span className="stat-label">Member since</span>
            <span className="stat-value">{stats.memberSince || "—"}</span>
          </article>
          <article className="profile-stat">
            <span className="stat-label">Focus</span>
            <span className="stat-value">
              {user?.addictionType ? user.addictionType : "Not set"}
            </span>
          </article>
          <article className="profile-stat">
            <span className="stat-label">Days strong</span>
            <span className="stat-value">
              {stats.soberDays ? `${stats.soberDays}` : "Let’s begin"}
            </span>
          </article>
        </div>
      </div>

      <JourneyTracker />

      <div className="profile-grid">
        <section className="card profile-card">
          <h2>Account details</h2>
          <div className="profile-details">
            {accountDetails.map((detail) => (
              <div key={detail.label} className="profile-row">
                <span className="key">{detail.label}</span>
                <span className="val">{detail.value}</span>
              </div>
            ))}
          </div>
          <p className="muted">
            Need to update something? Head to settings (coming soon) or drop us a
            note via support.
          </p>
        </section>

        <section className="card profile-card">
          <h2>Encouragements</h2>
          <ul className="profile-list">
            {encouragements.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="card profile-card profile-next">
          <h2>Next steps</h2>
          <div className="profile-next-grid">
            {nextSteps.map((step) => (
              <article key={step.title} className="next-card">
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
                {step.action?.to && (
                  <Link className="btn btn-ghost" to={step.action.to}>
                    {step.action.label}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="card profile-card profile-actions">
          <h2>Account actions</h2>
          <div className="actions">
            <Link className="btn" to="/settings">
              Update settings
            </Link>
            <Link className="btn" to="/support">
              Visit support centre
            </Link>
            <a className="btn" href="mailto:hello@breakfree.app">
              Email the team
            </a>
            <button className="btn btn-danger" onClick={logout}>
              Log out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
