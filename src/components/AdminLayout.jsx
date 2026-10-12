
import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h2>
          UZAIR <span>ADMIN</span>
        </h2>

        <button onClick={handleLogout}>
          Logout ↗
        </button>
      </header>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
