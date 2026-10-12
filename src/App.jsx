import { Navigate, Route, Routes } from "react-router-dom";
import HOME from "./pages/HOME";
import Admin from "./pages/Admin";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import "./App.css";

export default function App() {
  const isAuthenticated =
    sessionStorage.getItem("adminAuthenticated") === "true";

  return (
    <Routes>
      <Route path="/" element={<HOME />} />

      <Route
        path="/admin"
        element={
          isAuthenticated
            ? <Navigate to="/adminpanel" replace />
            : <Admin />
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/adminpanel" element={<AdminLayout />}>
          <Route index element={<AdminPanel />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
