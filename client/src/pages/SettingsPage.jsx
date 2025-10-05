import { useEffect, useState } from "react";
import { useAuthContext } from "../context/useAuthContext.js";
import api from "../utils/api.js";

const addictionOptions = [
  { value: "smoking", label: "Smoking" },
  { value: "drinking", label: "Drinking" },
  { value: "vaping", label: "Vaping" },
  { value: "sugar", label: "Sugar" },
  { value: "food", label: "Food" },
];

export default function SettingsPage() {
  const { user, refreshUser } = useAuthContext();

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    addictionType: "",
    quitDate: "",
  });
  const [profileStatus, setProfileStatus] = useState(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // NEW: delete button loading state
  const [deletePending, setDeletePending] = useState(false);

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      name: user.name || "",
      email: user.email || "",
      addictionType: user.addictionType || "",
      quitDate: user.quitDate
        ? new Date(user.quitDate).toISOString().slice(0, 10)
        : "",
    });
  }, [user]);

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

 
  const handleDeleteAccount = async () => {
    // 1) Ask the user to confirm
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

  
    setDeletePending(true);

    // 3) Try to delete the account
    try {
      await api.delete("/users/me"); 
    } catch (err) {
      alert(
        err?.response?.data?.error ||
          "Could not delete your account. Please try again."
      );
      setDeletePending(false);
      return;
    }

   
    api.post("/auth/logout").catch(() => {});

   
    localStorage.removeItem("authToken");
    window.location.href = "/"; 
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    if (!user) return;

    setProfileSubmitting(true);
    setProfileStatus(null);

    try {
      const payload = {
        username: profileForm.name, // keep as your backend expects
        email: profileForm.email,
        addictionType: profileForm.addictionType || undefined,
      };
      if (profileForm.quitDate) {
        payload.quitDate = profileForm.quitDate;
      }

      const response = await api.patch("/users/me", payload);
      if (response.status === 200) {
        await refreshUser();
        setProfileStatus({
          type: "success",
          message: "Profile updated successfully.",
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.error || "We couldn’t update your profile.";
      setProfileStatus({ type: "error", message });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    if (!user) return;

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordStatus({
        type: "error",
        message: "Both current and new password are required.",
      });
      return;
    }

    setPasswordSubmitting(true);
    setPasswordStatus(null);

    try {
      const response = await api.patch("/users/me/password", passwordForm);
      if (response.status === 200) {
        setPasswordStatus({
          type: "success",
          message: "Password changed successfully.",
        });
        setPasswordForm({ currentPassword: "", newPassword: "" });
      }
    } catch (error) {
      const message =
        error?.response?.data?.error || "Could not change your password.";
      setPasswordStatus({ type: "error", message });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div className="page settings-page">
      <section className="glass-panel">
        <span className="badge">Account preferences</span>
        <h1 className="title">Settings</h1>
        <p className="subtitle">
          Update your personal details, focus area, or reset your password to
          keep everything fresh.
        </p>

        <form className="form settings-form" onSubmit={submitProfile}>
          <h2>Profile details</h2>
          <label className="label">
            <span className="label-text">Name</span>
            <input
              className="input"
              value={profileForm.name}
              onChange={(event) =>
                handleProfileChange("name", event.target.value)
              }
              required
            />
          </label>

          <label className="label">
            <span className="label-text">Email</span>
            <input
              className="input"
              type="email"
              value={profileForm.email}
              onChange={(event) =>
                handleProfileChange("email", event.target.value)
              }
              required
            />
          </label>

          <label className="label">
            <span className="label-text">Primary focus</span>
            <select
              className="input"
              value={profileForm.addictionType}
              onChange={(event) =>
                handleProfileChange("addictionType", event.target.value)
              }
            >
              <option value="">Select a focus</option>
              {addictionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="label">
            <span className="label-text">Quit date</span>
            <input
              className="input"
              type="date"
              value={profileForm.quitDate}
              onChange={(event) =>
                handleProfileChange("quitDate", event.target.value)
              }
            />
          </label>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={profileSubmitting}
          >
            {profileSubmitting ? "Saving..." : "Save changes"}
          </button>

          {profileStatus && (
            <p className={profileStatus.type === "success" ? "success" : "error"}>
              {profileStatus.message}
            </p>
          )}
        </form>
      </section>

      <section className="glass-panel">
        <form className="form settings-form" onSubmit={submitPassword}>
          <h2>Change password</h2>

          <label className="label">
            <span className="label-text">Current password</span>
            <input
              className="input"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                handlePasswordChange("currentPassword", event.target.value)
              }
              required
            />
          </label>

          <label className="label">
            <span className="label-text">New password</span>
            <input
              className="input"
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                handlePasswordChange("newPassword", event.target.value)
              }
              minLength={6}
              required
            />
          </label>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={passwordSubmitting}
          >
            {passwordSubmitting ? "Updating..." : "Update password"}
          </button>

          {passwordStatus && (
            <p className={passwordStatus.type === "success" ? "success" : "error"}>
              {passwordStatus.message}
            </p>
          )}
        </form>
      </section>

      {/* NEW: Danger zone with delete button */}
      <section className="glass-panel">
        <div className="form settings-form">
          <h2>Danger zone</h2>
          <p className="subtitle">
            This permanently removes your account and related data.
          </p>

          <button
            type="button"
            className="btn btn-outline btn-danger"
            onClick={handleDeleteAccount}
            disabled={deletePending}
            aria-busy={deletePending ? "true" : "false"}
          >
            {deletePending ? "Deleting…" : "Delete account"}
          </button>
        </div>
      </section>
    </div>
  );
}
