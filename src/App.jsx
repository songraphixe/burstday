import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/authStore';
import { ToastProvider } from './components/ui/Toast';
import AppLayout from './components/layout/AppLayout';
import { PageLoader } from './components/ui/Loader';

// Pages (lazy would be better for prod, but eager for simplicity)
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AddBirthday from './pages/AddBirthday';
import BirthdayDetail from './pages/BirthdayDetail';
import SurpriseView from './pages/SurpriseView';
import SurprisesList from './pages/SurprisesList';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function ProtectedRoute() {
  const { user, loading } = useAuthStore();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  return <Outlet />;
}

function AuthRedirect() {
  const { user, loading } = useAuthStore();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/surprise/:token" element={<SurpriseView />} />

          {/* Auth (redirect if logged in) */}
          <Route element={<AuthRedirect />}>
            <Route path="/auth" element={<Auth />} />
          </Route>

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/birthdays" element={<Dashboard />} />
              <Route path="/birthdays/add" element={<AddBirthday />} />
              <Route path="/birthdays/:id" element={<BirthdayDetail />} />
              <Route path="/birthdays/:id/edit" element={<AddBirthday />} />
              <Route path="/surprises" element={<SurprisesList />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
