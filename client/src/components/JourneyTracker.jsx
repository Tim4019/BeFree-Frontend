import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext.js";
import api from "../utils/api.js";
import SobrietyClock from "./SobrietyClock.jsx";
import Milestones from "./Milestones.jsx";

export default function JourneyTracker() {
  const { user, refreshUser } = useAuthContext();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const quitDate = user?.quitDate ? new Date(user.quitDate) : null;

  const handleStart = async () => {
    try {
      setPending(true);
      setError(null);
      await api.patch("/users/me", { quitDate: new Date().toISOString() });
      await refreshUser();
    } catch (err) {
      const message =
        err?.response?.data?.error || "We couldn’t start the clock just yet.";
      setError(message);
    } finally {
      setPending(false);
    }
  };

  const handleReset = async () => {
    try {
      setPending(true);
      setError(null);
      await api.patch("/users/me", { quitDate: null });
      await refreshUser();
    } catch (err) {
      const message =
        err?.response?.data?.error || "We couldn’t reset the clock right now.";
      setError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="journey glass-panel">
      {!quitDate ? (
        <div className="card start-box">
          <h3 className="card-title">Begin Your Journey</h3>
          <p className="muted">
            Set your official day one and the app will start tracking milestones
            automatically.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleStart}
            disabled={pending}
          >
            {pending ? "Starting…" : "Start my clock"}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <>
          <SobrietyClock />
          <Milestones />
          <button
            className="btn btn-danger"
            onClick={handleReset}
            disabled={pending}
          >
            {pending ? "Resetting…" : "Reset clock"}
          </button>
          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
}
