import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext.js";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const { signup } = useAuthContext();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [toggle, setToggle] = useState(false);

  return (
    <form className="form form-auth" onSubmit={(e) => signup(form, setToggle, e)}>
      <h2 className="title">Sign up</h2>

      <label className="label">
        <span className="label-text">Name</span>
        <input
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </label>

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

      <button className="btn btn-primary" type="submit">Create account</button>

      <p className="muted">
        Already have an account? <Link to="/login" className="link">Log in</Link>
      </p>

      {toggle && <p className="success">Account created. Please log in.</p>}
    </form>
  );
}
