import LiveVisitors from "../components/LiveVisitors";
import ProjectsManager from "../components/ProjectsManager";
import ReviewsManager from "../components/ReviewsManager";

export default function AdminPanel() {
  return (
    <>
      <div className="admin-intro">
        <p className="admin-label">ADMINISTRATION / OVERVIEW</p>
        <h1>Welcome back, Uzair<span>.</span></h1>
      </div>

      <LiveVisitors />
      <ProjectsManager />
      <ReviewsManager />
    </>
  );
}
