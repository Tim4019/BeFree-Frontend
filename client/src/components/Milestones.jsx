import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../context/useAuthContext.js";
import api from "../utils/api.js";

function daysBetween(startDate) {
  if (!startDate) return 0;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return 0;
  const today = new Date();
  const diff = Math.floor(
    (today.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  return diff >= 0 ? diff + 1 : 0;
}

export default function Milestones() {
  const { user } = useAuthContext();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);

  const daysSinceQuit = useMemo(() => daysBetween(user?.quitDate), [user?.quitDate]);

  const progressInfo = useMemo(() => {
    if (!user?.quitDate || !milestones.length) return null;
    const next = milestones.find((milestone) => !milestone.achieved);
    if (!next) {
      return {
        achievedAll: true,
        progress: 100,
        label: "All milestones achieved",
        hint: "Celebrate your wins and keep logging your journey.",
      };
    }
    const ratio = Math.min(daysSinceQuit / next.targetDays, 1);
    const remaining = Math.max(next.targetDays - daysSinceQuit, 0);
    return {
      achievedAll: false,
      progress: Math.round(ratio * 100),
      label: next.title,
      hint:
        remaining === 0
          ? "Ready to mark this milestone completed."
          : `${remaining} day${remaining === 1 ? '' : 's'} until this milestone`,
    };
  }, [user?.quitDate, milestones, daysSinceQuit]);

  useEffect(() => {
    let ignore = false;

    async function fetchMilestones() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/milestones");
        if (ignore) return;
        const data = response.data?.milestones || [];
        setMilestones(data);
      } catch (error) {
        console.error("Failed to load milestones", error);
        if (!ignore)
          setError("Could not load milestones yet. Try refreshing in a moment.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchMilestones();
    return () => {
      ignore = true;
    };
  }, []);

  const markAchieved = async (milestone) => {
    try {
      setUpdating(milestone._id);
      setError(null);
      const response = await api.patch(`/milestones/${milestone._id}`, {
        achieved: true,
        dateAchieved: new Date().toISOString(),
      });
      setMilestones((prev) =>
        prev.map((item) => (item._id === milestone._id ? response.data : item))
      );
    } catch (error) {
      const message =
        error?.response?.data?.error || "We couldn’t update that milestone right now.";
      setError(message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="card milestones">
      <h3 className="card-title">Milestones</h3>

      {loading && <p className="muted">Loading milestones…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !user?.quitDate && (
        <p className="muted">Set your quit date to start tracking milestones.</p>
      )}

      {!loading && milestones.length === 0 && user?.quitDate && (
        <p className="muted">Milestones will appear here as soon as they are ready.</p>
      )}

      {progressInfo && (
        <div className="progress-wrapper">
          <div className="progress-labels">
            <span className="progress-title">
              {progressInfo.achievedAll ? progressInfo.label : `Next: ${progressInfo.label}`}
            </span>
            <span className="progress-value">{progressInfo.progress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressInfo.progress}%` }}
            />
          </div>
          <p className="progress-hint">{progressInfo.hint}</p>
        </div>
      )}

      {!loading && milestones.length > 0 && (
        <ul className="milestone-list">
          {milestones.map((milestone) => {
            const achieved = Boolean(milestone.achieved);
            const due = daysSinceQuit >= milestone.targetDays;
            const remaining = Math.max(milestone.targetDays - daysSinceQuit, 0);

            return (
              <li
                key={milestone._id}
                className={`milestone-row ${
                  achieved ? "achieved" : due ? "due" : "upcoming"
                }`}
              >
                <div>
                  <p className="milestone-title">{milestone.title}</p>
                  <p className="milestone-meta">
                    {milestone.targetDays} days •
                    {" "}
                    {achieved
                      ? milestone.dateAchieved
                        ? `Achieved ${new Date(
                            milestone.dateAchieved
                          ).toLocaleDateString()}`
                        : "Completed"
                      : due
                      ? "Ready to celebrate"
                      : `${remaining} day${remaining === 1 ? "" : "s"} to go`}
                  </p>
                </div>

                {achieved ? (
                  <span className="milestone-status">✅</span>
                ) : (
                  <button
                    className="btn btn-ghost milestone-action"
                    disabled={!due || updating === milestone._id}
                    onClick={() => markAchieved(milestone)}
                  >
                    {updating === milestone._id ? "Saving…" : due ? "Mark achieved" : "Not yet"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
