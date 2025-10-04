import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { AuthContext } from "./AuthContext.js";

function extractErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken"));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const persistToken = useCallback((token) => {
    if (token) {
      localStorage.setItem("authToken", token);
      setAuthToken(token);
    } else {
      localStorage.removeItem("authToken");
      setAuthToken(null);
    }
  }, []);

  const verify = useCallback(
    async (token, { showLoader = true } = {}) => {
      const activeToken = token ?? authToken ?? localStorage.getItem("authToken");
      if (!activeToken) {
        setUser(null);
        if (showLoader) setLoading(false);
        return null;
      }

      if (showLoader) setLoading(true);
      try {
        const response = await api.get("/auth/verify", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        setUser(response.data.payload);
        setAuthError(null);
        return response.data.payload;
      } catch (error) {
        console.log("verify error:", error);
        persistToken(null);
        setUser(null);
        setAuthError(extractErrorMessage(error, "Session expired"));
        return null;
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [authToken, persistToken]
  );

  const signup = useCallback(
    async (body, setToggle, event) => {
      if (event?.preventDefault) event.preventDefault();
      setAuthError(null);
      try {
        const response = await api.post("/auth/signup", body);
        const token = response.data?.authToken;
        if (token) {
          persistToken(token);
          await verify(token, { showLoader: true });
          navigate("/profile");
        } else if (typeof setToggle === "function") {
          setToggle((prev) => !prev);
        }
        return true;
      } catch (error) {
        const message = extractErrorMessage(
          error,
          "We couldn’t create your account"
        );
        setAuthError(message);
        return false;
      }
    },
    [navigate, persistToken, verify]
  );

  const login = useCallback(
    async (body, event) => {
      if (event?.preventDefault) event.preventDefault();
      setAuthError(null);
      try {
        const response = await api.post("/auth/login", body);
        const token = response.data?.authToken;
        if (token) {
          persistToken(token);
          await verify(token, { showLoader: true });
          navigate("/profile");
        }
        return true;
      } catch (error) {
        const message = extractErrorMessage(
          error,
          "Invalid email or password"
        );
        setAuthError(message);
        return false;
      }
    },
    [navigate, persistToken, verify]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log("logout error:", error);
    } finally {
      persistToken(null);
      setUser(null);
      setAuthError(null);
      navigate("/");
    }
  }, [navigate, persistToken]);

  const refreshUser = useCallback(async () => {
    const token = authToken ?? localStorage.getItem("authToken");
    if (!token) return null;
    return verify(token, { showLoader: false });
  }, [authToken, verify]);

  useEffect(() => {
    verify(authToken);
  }, [authToken, verify]);

  const contextValue = useMemo(
    () => ({
      user,
      authToken,
      loading,
      authError,
      login,
      signup,
      logout,
      refreshUser,
      clearAuthError: () => setAuthError(null),
      isAuthenticated: Boolean(user?.id),
    }),
    [authError, authToken, loading, login, logout, refreshUser, signup, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
