import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext.js";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuthContext();
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <form className="form form-auth" onSubmit={(e) => login(form, e)}>
      <h2 className="title">Log in</h2>

      <label className="label">
        <span className="label-text">Email</span>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
      </label>

      <label className="label">
        <span className="label-text">Password</span>
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
        />
      </label>

      <button className="btn btn-primary" type="submit">Log in</button>

      <p className="muted">
        No account? <Link to="/signup" className="link">Sign up</Link>
      </p>
    </form>
  );
}
