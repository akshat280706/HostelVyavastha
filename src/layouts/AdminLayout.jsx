import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Calendar, Building2, DollarSign, Bell, AlertCircle, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/attendance', icon: Calendar, label: 'Attendance' },
    { to: '/admin/rooms', icon: Building2, label: 'Rooms' },
    { to: '/admin/fees', icon: DollarSign, label: 'Fees' },
    { to: '/admin/notices', icon: Bell, label: 'Notices' },
    { to: '/admin/complaints', icon: AlertCircle, label: 'Complaints' },
  ];

  return (
    <div className="app-root">
      <div className="app-sidebar">
        <div className="app-sidebar-logo">Hostel Admin</div>

        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className="app-sidebar-link">
            <item.icon size={18} /> {item.label}
          </NavLink>
        ))}

        <button onClick={logout} className="app-sidebar-link">Logout</button>
      </div>

      <div className="app-main-container">
        <div className="app-topbar">
          <div>Welcome, {user?.name}</div>
          <div>{user?.email}</div>
        </div>

        <div className="app-main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}