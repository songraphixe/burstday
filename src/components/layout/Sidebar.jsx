import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Cake, Sparkles, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import Avatar from '../ui/Avatar';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/birthdays', icon: Cake, label: 'Birthdays' },
  { to: '/surprises', icon: Sparkles, label: 'Surprises' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, profile, signOut } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();
  const isLight = theme === 'light';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-64 h-screen border-r p-5 sticky top-0 transition-colors duration-250"
      style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Logo */}
      <div className="mb-8 px-2 flex items-center justify-between">
        <span className="text-2xl font-bold font-display gradient-text">Burstday</span>
        <button
          onClick={toggle}
          className="p-1.5 rounded-xl transition-all hover:scale-110"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {isLight
            ? <Moon size={15} style={{ color: 'var(--text-muted)' }} />
            : <Sun size={15} style={{ color: 'var(--text-muted)' }} />
          }
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-burst-gradient text-white shadow-[0_0_20px_rgba(255,55,95,0.25)]'
                  : ''
              }`
            }
            style={({ isActive }) => isActive ? {} : { color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'var(--bg-input)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = '';
                e.currentTarget.style.color = 'var(--text-muted)';
              }
            }}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="pt-4 mt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3 px-2 mb-3">
          <Avatar name={profile?.full_name || user?.email} src={profile?.avatar_url} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 w-full rounded-xl text-sm transition-all"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
