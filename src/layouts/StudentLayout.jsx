import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function StudentLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-root">
      <div className="app-sidebar">
        <div className="app-sidebar-logo">Student Portal</div>

        <p>{user?.name}</p>
        <p>Room: {user?.roomNumber}</p>

        <button onClick={logout} className="app-sidebar-link">Logout</button>
      </div>

      <div className="app-main-container">
        <div className="app-topbar">
          Welcome, {user?.name}
        </div>

        <div className="app-main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}