import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const { user, initialized } = useSelector((s) => s.auth);

  if (!initialized) {
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.role ? "/dashboard" : "/choose-role"} replace />;
  }

  return <Outlet />;
}
