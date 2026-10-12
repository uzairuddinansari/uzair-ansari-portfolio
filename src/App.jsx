import { Navigate, Route, Routes } from "react-router-dom";
import HOME from "./pages/HOME";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Admin from "./pages/Admin";
import AdminPanel from "./pages/AdminPanel";
import AdminVisitors from "./pages/AdminVisitors";
import AdminProjects from "./pages/AdminProjects";
import AdminSkills from "./pages/AdminSkills";
import AdminReviews from "./pages/AdminReviews";
import AdminMessages from "./pages/AdminMessages";
import AdminAppearance from "./pages/AdminAppearance";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* Public website */}
      <Route path="/" element={<HOME />} />

      {/* Login (already logged in ho to Admin.jsx khud /adminpanel bhej deta hai) */}
      <Route path="/admin" element={<Admin />} />

      {/* Admin panel: sirf login ke baad. Sidebar AdminLayout mein hai,
          neeche ke pages uske <Outlet /> mein khulte hain */}
      <Route element={<ProtectedRoute />}>
        <Route path="/adminpanel" element={<AdminLayout />}>
          <Route index element={<AdminPanel />} />
          <Route path="visitors" element={<AdminVisitors />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="appearance" element={<AdminAppearance />} />
        </Route>
      </Route>

      <Route path="/about" element={<About />} />
      <Route path="/skills" element={<Skills />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

