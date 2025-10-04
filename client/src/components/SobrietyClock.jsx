import { useEffect, useState } from "react";
import { useAuthContext } from "../context/useAuthContext.js";

function calculateDiff(startDate) {
  if (!startDate) return null;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return null;
  const now = new Date();
  const diff = now - start;
  if (diff < 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function SobrietyClock() {
  const { user } = useAuthContext();
  const quitDate = user?.quitDate;
  const [time, setTime] = useState(() => calculateDiff(quitDate));

  useEffect(() => {
    if (!quitDate) {
      setTime(null);
      return undefined;
    }

    setTime(calculateDiff(quitDate));
    const interval = setInterval(() => {
      setTime(calculateDiff(quitDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [quitDate]);

  return (
    <div className="card clock">
      <h3 className="card-title">Sobriety Clock</h3>
      {time ? (
        <p className="clock-time">
          {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
        </p>
      ) : (
        <p className="muted">Set your quit date to start the live clock.</p>
      )}
    </div>
  );
}
