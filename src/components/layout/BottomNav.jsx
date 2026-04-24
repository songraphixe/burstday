import { NavLink } from 'react-router-dom';
import { Home, Cake, Plus, Sparkles, Settings } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/birthdays', icon: Cake, label: 'Birthdays' },
  { to: '/birthdays/add', icon: Plus, label: 'Add', isCenter: true },
  { to: '/surprises', icon: Sparkles, label: 'Surprises' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t pb-safe transition-colors duration-250"
      style={{ background: 'color-mix(in srgb, var(--bg-sidebar) 95%, transparent)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-end justify-around px-2 pt-2 pb-3">
        {navItems.map(({ to, icon: Icon, label, isCenter }) =>
          isCenter ? (
            <NavLink key={to} to={to} className="relative -mt-5 flex flex-col items-center">
              <div className="gradient-context w-14 h-14 rounded-full bg-burst-gradient flex items-center justify-center shadow-[0_0_30px_rgba(255,55,95,0.4)] active:scale-95 transition-transform">
                <Icon size={22} className="text-white" />
              </div>
              <span className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </NavLink>
          ) : (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all"
              style={({ isActive }) => ({ color: isActive ? '#FF375F' : 'var(--text-muted)' })}
            >
              <Icon size={20} />
              <span className="text-[10px]">{label}</span>
            </NavLink>
          )
        )}
      </div>
    </nav>
  );
}
