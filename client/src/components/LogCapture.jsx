import { useMemo, useRef, useState } from "react";
import api from "../utils/api.js";
import {
  copingPresets,
  moodOptions,
  triggerPresets,
} from "../constants/logOptions.js";

const MAX_LIST_ITEMS = 6;

function toLocalInputValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function toggleArrayItem(list, value) {
  if (!value) return list;
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function addArrayItem(list, value) {
  if (!value) return list;
  const trimmed = value.trim();
  if (!trimmed) return list;
  if (list.includes(trimmed)) return list;
  if (list.length >= MAX_LIST_ITEMS) return list;
  return [...list, trimmed];
}

function removeArrayItem(list, value) {
  return list.filter((item) => item !== value);
}

function ensureUniqueTag(list, tag) {
  if (!tag) return list;
  if (list.includes(tag)) return list;
  if (list.length >= 8) return list;
  return [...list, tag];
}

function buildPayload(formState) {
  const payload = {
    note: formState.note.trim(),
    mood: formState.moodEnabled
      ? moodOptions[formState.moodIndex]?.value || null
      : null,
    cravingLevel: formState.cravingLevel,
    triggers: formState.triggers,
    copingActions: formState.copingActions,
    gratitude: formState.gratitude.trim(),
    slip: formState.slip,
    tags: formState.tags,
  };

  if (formState.at) {
    const atDate = new Date(formState.at);
    if (!Number.isNaN(atDate.getTime())) {
      payload.at = atDate.toISOString();
    }
  }

  return payload;
}

const quickActions = [
  {
    key: "slip",
    label: "Slip",
    helper: "Log the moment with kindness",
    tag: "slip",
    apply(state) {
      const next = { ...state };
      next.slip = true;
      next.moodEnabled = true;
      if (next.moodIndex > 1) next.moodIndex = 1;
      next.tags = ensureUniqueTag(next.tags, "slip");
      return next;
    },
    focus: "note",
  },
  {
    key: "craving",
    label: "Craving",
    helper: "Capture triggers while it’s fresh",
    tag: "craving",
    apply(state) {
      const next = { ...state };
      next.cravingLevel = Math.max(state.cravingLevel, 4);
      next.tags = ensureUniqueTag(next.tags, "craving");
      return next;
    },
    focus: "trigger",
  },
  {
    key: "win",
    label: "Win",
    helper: "Celebrate a highlight",
    tag: "win",
    apply(state) {
      const next = { ...state };
      next.tags = ensureUniqueTag(next.tags, "win");
      if (!next.gratitude) next.gratitude = "";
      return next;
    },
    focus: "gratitude",
  },
];

function defaultState() {
  return {
    moodIndex: 2,
    moodEnabled: true,
    cravingLevel: 0,
    slip: false,
    note: "",
    triggers: [],
    copingActions: [],
    gratitude: "",
    tags: [],
    at: toLocalInputValue(),
  };
}

export default function LogCapture({ onCreated }) {
  const [form, setForm] = useState(() => defaultState());
  const [showDetails, setShowDetails] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState(null);
  const [customTrigger, setCustomTrigger] = useState("");
  const [customCoping, setCustomCoping] = useState("");

  const noteRef = useRef(null);
  const triggerRef = useRef(null);
  const gratitudeRef = useRef(null);

  const moodSelection = useMemo(
    () => moodOptions[form.moodIndex] ?? moodOptions[2],
    [form.moodIndex]
  );

  const handleQuickAction = (action) => {
    setForm((prev) => action.apply({ ...prev }));
    setStatus(null);

    const focusTarget = action.focus;
    requestAnimationFrame(() => {
      if (focusTarget === "note" && noteRef.current) noteRef.current.focus();
      if (focusTarget === "trigger" && triggerRef.current)
        triggerRef.current.focus();
      if (focusTarget === "gratitude" && gratitudeRef.current)
        gratitudeRef.current.focus();
    });
  };

  const submitLog = async (event) => {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setStatus(null);

    try {
      const payload = buildPayload(form);
      const { data } = await api.post("/logs", payload);

      setStatus({ type: "success", message: "Logged. Keep going." });
      setForm(() => defaultState());
      setShowDetails(false);
      setShowTime(false);
      setCustomTrigger("");
      setCustomCoping("");

      if (typeof onCreated === "function" && data) {
        onCreated(data);
      }
    } catch (error) {
      const message =
        error?.response?.data?.error || "Could not save the log just yet.";
      setStatus({ type: "error", message });
    } finally {
      setPending(false);
    }
  };

  const addTrigger = (value) => {
    setForm((prev) => ({
      ...prev,
      triggers: addArrayItem(prev.triggers, value),
    }));
    setCustomTrigger("");
  };

  const addCoping = (value) => {
    setForm((prev) => ({
      ...prev,
      copingActions: addArrayItem(prev.copingActions, value),
    }));
    setCustomCoping("");
  };

  const removeTrigger = (value) => {
    setForm((prev) => ({
      ...prev,
      triggers: removeArrayItem(prev.triggers, value),
    }));
  };

  const removeCoping = (value) => {
    setForm((prev) => ({
      ...prev,
      copingActions: removeArrayItem(prev.copingActions, value),
    }));
  };

  const removeTag = (value) => {
    setForm((prev) => ({
      ...prev,
      tags: removeArrayItem(prev.tags, value),
    }));
  };

  const toggleSlip = () => {
    setForm((prev) => ({
      ...prev,
      slip: !prev.slip,
      tags: !prev.slip
        ? ensureUniqueTag(prev.tags, "slip")
        : removeArrayItem(prev.tags, "slip"),
    }));
  };

  const handleMoodToggle = () => {
    setForm((prev) => ({
      ...prev,
      moodEnabled: !prev.moodEnabled,
    }));
  };

  const handleTimestampReset = () => {
    setForm((prev) => ({
      ...prev,
      at: toLocalInputValue(),
    }));
  };

  return (
    <section className="card log-capture">
      <header className="log-capture-header">
        <div>
          <span className="badge">Quick check-in</span>
          <h2 className="card-title">How are you arriving today?</h2>
          <p className="muted">
            Slide, tag, and jot a few words. Your future self will thank you for
            the detail.
          </p>
        </div>
        <div className="quick-actions">
          {quickActions.map((action) => (
            <button
              key={action.key}
              type="button"
              className="pill-button"
              onClick={() => handleQuickAction(action)}
              disabled={pending}
            >
              <span>{action.label}</span>
              <small>{action.helper}</small>
            </button>
          ))}
        </div>
      </header>

      <form className="log-form" onSubmit={submitLog}>
        <fieldset className="mood-field">
          <legend>
            Mood
            <button
              type="button"
              className="link-button"
              onClick={handleMoodToggle}
            >
              {form.moodEnabled ? "Skip" : "Track mood"}
            </button>
          </legend>

          {form.moodEnabled ? (
            <div className="mood-slider">
              <input
                type="range"
                min="0"
                max={moodOptions.length - 1}
                value={form.moodIndex}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    moodIndex: Number(event.target.value) || 0,
                  }))
                }
                disabled={pending}
              />
              <div className="mood-markers">
                {moodOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`mood-marker${
                      index === form.moodIndex ? " mood-marker-active" : ""
                    }`}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        moodIndex: index,
                      }))
                    }
                    disabled={pending}
                  >
                    <span aria-hidden="true">{option.emoji}</span>
                    <small>{option.label}</small>
                  </button>
                ))}
              </div>
              <p className="mood-helper">{moodSelection.helper}</p>
            </div>
          ) : (
            <p className="muted">Mood skipped for this entry.</p>
          )}
        </fieldset>

        <fieldset className="craving-field">
          <legend>Craving level</legend>
          <div className="craving-slider">
            <input
              type="range"
              min="0"
              max="5"
              value={form.cravingLevel}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  cravingLevel: Number(event.target.value) || 0,
                }))
              }
              disabled={pending}
            />
            <div className="craving-scale">
              <span>None</span>
              <span>Peaking</span>
            </div>
          </div>
        </fieldset>

        <div className="switch-row">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.slip}
              onChange={toggleSlip}
              disabled={pending}
            />
            <span>Mark as slip</span>
          </label>

          <button
            type="button"
            className="link-button"
            onClick={() => setShowTime((prev) => !prev)}
          >
            {showTime ? "Hide timestamp" : "Adjust timestamp"}
          </button>
        </div>

        {showTime && (
          <div className="timestamp-field">
            <label>
              <span className="label-text">Logged at</span>
              <input
                type="datetime-local"
                value={form.at}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    at: event.target.value,
                  }))
                }
                max={toLocalInputValue()}
                disabled={pending}
              />
            </label>
            <button
              type="button"
              className="link-button"
              onClick={handleTimestampReset}
            >
              Reset to now
            </button>
          </div>
        )}

        <label className="label">
          <span className="label-text">Notes</span>
          <textarea
            ref={noteRef}
            rows="3"
            value={form.note}
            placeholder="What happened, how did it feel, what do you want to remember?"
            onChange={(event) =>
              setForm((prev) => ({ ...prev, note: event.target.value }))
            }
            disabled={pending}
          />
        </label>

        <button
          type="button"
          className="link-button"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {showDetails ? "Hide" : "More"} grounding details
        </button>

        {showDetails && (
          <div className="details-grid">
            <fieldset>
              <legend>Triggers noticed</legend>
              <div className="toggle-grid">
                {triggerPresets.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`toggle-pill${
                      form.triggers.includes(item) ? " toggle-pill-active" : ""
                    }`}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        triggers: toggleArrayItem(prev.triggers, item),
                      }))
                    }
                    disabled={pending}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="tag-input">
                <input
                  ref={triggerRef}
                  type="text"
                  value={customTrigger}
                  onChange={(event) => setCustomTrigger(event.target.value)}
                  placeholder="Add custom trigger"
                  disabled={pending}
                />
                <button
                  type="button"
                  onClick={() => addTrigger(customTrigger)}
                  disabled={pending || !customTrigger.trim()}
                >
                  Add
                </button>
              </div>
              {form.triggers.length > 0 && (
                <div className="tag-list">
                  {form.triggers.map((item) => (
                    <span key={item} className="tag-chip">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeTrigger(item)}
                        aria-label={`Remove ${item}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </fieldset>

            <fieldset>
              <legend>Coping moves</legend>
              <div className="toggle-grid">
                {copingPresets.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`toggle-pill${
                      form.copingActions.includes(item)
                        ? " toggle-pill-active"
                        : ""
                    }`}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        copingActions: toggleArrayItem(prev.copingActions, item),
                      }))
                    }
                    disabled={pending}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="tag-input">
                <input
                  type="text"
                  value={customCoping}
                  onChange={(event) => setCustomCoping(event.target.value)}
                  placeholder="Add custom support move"
                  disabled={pending}
                />
                <button
                  type="button"
                  onClick={() => addCoping(customCoping)}
                  disabled={pending || !customCoping.trim()}
                >
                  Add
                </button>
              </div>
              {form.copingActions.length > 0 && (
                <div className="tag-list">
                  {form.copingActions.map((item) => (
                    <span key={item} className="tag-chip">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeCoping(item)}
                        aria-label={`Remove ${item}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </fieldset>

            <label className="label">
              <span className="label-text">Gratitude or highlight</span>
              <input
                ref={gratitudeRef}
                type="text"
                value={form.gratitude}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    gratitude: event.target.value,
                  }))
                }
                placeholder="Even a tiny win counts"
                disabled={pending}
              />
            </label>
          </div>
        )}

        {form.tags.length > 0 && (
          <div className="tag-badges">
            {form.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="tag-pill"
                onClick={() => removeTag(tag)}
                disabled={pending}
              >
                {tag}
                <span aria-hidden="true"> ×</span>
              </button>
            ))}
          </div>
        )}

        {status && (
          <p className={status.type === "error" ? "error" : "success"}>
            {status.message}
          </p>
        )}

        <div className="log-form-footer">
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save entry"}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setForm(() => defaultState());
              setShowDetails(false);
              setShowTime(false);
              setCustomTrigger("");
              setCustomCoping("");
              setStatus(null);
            }}
            disabled={pending}
          >
            Reset form
          </button>
        </div>
      </form>
    </section>
  );
}
