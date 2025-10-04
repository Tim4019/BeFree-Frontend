import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext.js";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) return <div className="loader">Checking session…</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
