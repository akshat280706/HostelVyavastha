import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Calendar, Building2, DollarSign, Bell, MessageSquare, User, LogOut, GraduationCap } from 'lucide-react';

export default function StudentLayout() {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/attendance', icon: Calendar, label: 'My Attendance' },
    { to: '/student/room', icon: Building2, label: 'My Room' },
    { to: '/student/fees', icon: DollarSign, label: 'My Fees' },
    { to: '/student/notices', icon: Bell, label: 'Notices' },
    { to: '/student/complaints', icon: MessageSquare, label: 'Complaints' },
    { to: '/student/profile', icon: User, label: 'My Profile' },
  ];

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';

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
              <GraduationCap size={16} color="white" />
            </div>
            <div>
              <h2 style={{ marginBottom: 0 }}>HostelMS</h2>
              <p>Student Portal</p>
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
              <div className="sidebar-user-role">Room {user?.roomNumber || 'N/A'}</div>
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
