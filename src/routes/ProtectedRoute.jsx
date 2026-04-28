import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role = false }) {
  const { user, initialized } = useSelector((s) => s.auth);

  if (!initialized) {
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && !user.role) return <Navigate to="/choose-role" replace />;

  return children;
}
