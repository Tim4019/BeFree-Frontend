import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { AuthContext } from "./AuthContext.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verify = async (token, { showLoader = true } = {}) => {
    if (showLoader) setLoading(true);
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;
      const response = await api.get("/auth/verify", config);
      if (response.status === 200) {
        setUser(response.data.payload);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log("verify error:", err);
      setUser(null);
      if (token) localStorage.removeItem("authToken");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const signup = async (body, setToggle, e) => {
    if (e?.preventDefault) e.preventDefault();
    try {
      const response = await api.post("/auth/signup", body);
      if (response.status === 201 || response.status === 200) {
        const token = response.data.authToken;
        if (token) {
          localStorage.setItem("authToken", token);
          await verify(token);
          navigate("/profile");
        } else if (typeof setToggle === "function") {
          setToggle((prev) => !prev);
        }
      }
    } catch (err) {
      console.log("signup error:", err);
    }
  };

  const login = async (body, e) => {
    if (e?.preventDefault) e.preventDefault();
    try {
      const response = await api.post("/auth/login", body);
      if (response.status === 200 || response.status === 201) {
        const token = response.data.authToken;
        if (token) localStorage.setItem("authToken", token);
        await verify(token);
        navigate("/profile");
      }
    } catch (err) {
      console.log("login error:", err);
    }
  };

  const logout = () => {
    api.post("/auth/logout").catch(() => {});
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/");
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("authToken");
    await verify(token, { showLoader: false });
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    verify(token);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
