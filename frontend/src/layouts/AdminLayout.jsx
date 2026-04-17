import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Calendar, Building2, DollarSign, Bell, AlertCircle, LogOut, Shield } from 'lucide-react';

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

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'var(--primary)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}>
              <Shield size={16} color="white" />
            </div>
            <div>
              <h2 style={{ marginBottom: 0 }}>HostelMS</h2>
              <p>Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-nav-label">Navigation</span>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="sidebar-nav-link">
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={logout}>
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
