import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">AT</div>
          <span className="navbar-title">AttendanceTracker</span>
        </Link>
        <div className="navbar-actions">
          {isHome ? (
            <Link to="/attendance" className="btn btn-primary btn-sm">
              Mark Attendance
            </Link>
          ) : (
            <Link to="/" className="btn btn-ghost btn-sm">
              ← Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
