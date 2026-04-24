import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <main className="flex-1 min-w-0 pb-24 lg:pb-0 overflow-x-hidden">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
