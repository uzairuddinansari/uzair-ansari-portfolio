
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated =
    sessionStorage.getItem("adminAuthenticated") === "true";

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/admin" replace state={{ from: location }} />;
}
