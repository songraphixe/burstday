import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Search, SlidersHorizontal, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useBirthdayStore } from '../store/birthdayStore';
import { getTimeGreeting, getDaysUntilBirthday, formatDate } from '../lib/utils';
import { continuousConfetti } from '../lib/confetti';
import { pageVariants, staggerContainer } from '../lib/animations';
import BirthdayCard from '../components/birthdays/BirthdayCard';
import UpcomingStrip from '../components/birthdays/UpcomingStrip';
import WishGenerator from '../components/wishes/WishGenerator';
import SurpriseBuilder from '../components/surprise/SurpriseBuilder';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

export default function Dashboard() {
  const { user, profile } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const { birthdays, upcoming, loading, fetchBirthdays, fetchUpcoming, deleteBirthday } = useBirthdayStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('upcoming');
  const [wishTarget, setWishTarget] = useState(null);
  const [surpriseTarget, setSurpriseTarget] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user && birthdays.length === 0 && !loading) {
      Promise.all([fetchBirthdays(user.id), fetchUpcoming(user.id)]);
    }
  }, [user]);

  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  const todayBirthdays = birthdays.filter((b) => getDaysUntilBirthday(b.birth_date) === 0);
  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  const filtered = birthdays
    .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
    .filter((b) => filter === 'all' || b.relationship === filter)
    .sort((a, b) => {
      if (sort === 'upcoming') return getDaysUntilBirthday(a.birth_date) - getDaysUntilBirthday(b.birth_date);
      if (sort === 'alpha') return a.name.localeCompare(b.name);
      return new Date(b.created_at) - new Date(a.created_at);
    });

  // Stats
  const thisMonth = birthdays.filter((b) => {
    const m = new Date(b.birth_date).getMonth();
    return m === new Date().getMonth();
  }).length;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="max-w-4xl mx-auto px-4 pt-6 pb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-white/40 text-sm">{getTimeGreeting()},</p>
          <h1 className="text-2xl font-bold font-display">{firstName} 👋</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme toggle — mobile only (sidebar has it on desktop) */}
          <button
            onClick={toggle}
            className="lg:hidden p-2 rounded-xl transition-all hover:scale-110"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-xl transition-all relative"
              style={{ color: 'var(--text-muted)' }}
              title="Notifications"
            >
              <Bell size={20} />
              {upcoming.filter((b) => b.days_until <= 7).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF375F]" />
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-72 rounded-3xl border shadow-2xl overflow-hidden"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', zIndex: 100 }}
                >
                  <div className="px-4 pt-4 pb-2">
                    <p className="font-semibold text-sm font-display">Upcoming Birthdays</p>
                  </div>
                  {upcoming.filter((b) => b.days_until <= 30).length === 0 ? (
                    <div className="px-4 pb-4 text-center">
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No birthdays in the next 30 days 🎉</p>
                    </div>
                  ) : (
                    <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                      {upcoming.filter((b) => b.days_until <= 30).slice(0, 6).map((b) => (
                        <button
                          key={b.id}
                          onClick={() => { setNotifOpen(false); setWishTarget(b); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                        >
                          <span className="text-lg">{b.days_until === 0 ? '🎂' : b.days_until <= 3 ? '🔴' : b.days_until <= 7 ? '🟡' : '📅'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{b.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {b.days_until === 0 ? 'Today! 🎉' : `In ${b.days_until} day${b.days_until === 1 ? '' : 's'}`}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{
                            background: b.days_until === 0 ? 'rgba(255,55,95,0.15)' : b.days_until <= 7 ? 'rgba(255,179,64,0.15)' : 'var(--bg-card)',
                            color: b.days_until === 0 ? '#FF375F' : b.days_until <= 7 ? '#FFB340' : 'var(--text-muted)',
                          }}>
                            Send wish
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="px-4 py-2.5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <button onClick={() => { setNotifOpen(false); navigate('/settings'); }} className="text-xs w-full text-center transition-colors" style={{ color: 'var(--text-muted)' }}>
                      Manage notification settings →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => navigate('/settings')} className="rounded-full hover:ring-2 hover:ring-[#FF375F]/50 transition-all">
            <Avatar name={profile?.full_name || user?.email} src={profile?.avatar_url} size="sm" />
          </button>
        </div>
      </div>

      {/* Today's birthday banner */}
      {todayBirthdays.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gradient-context relative mb-6 p-5 rounded-3xl overflow-hidden cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #FF375F 0%, #FF6B2C 50%, #FFB340 100%)' }}
          data-gradient="true"
          onClick={() => { continuousConfetti(3000); setWishTarget(todayBirthdays[0]); }}
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative">
            <p className="text-white/80 text-sm font-medium">🎂 Today's Birthday</p>
            <h2 className="text-2xl font-bold font-display text-white mt-0.5">
              {todayBirthdays.map((b) => b.name).join(', ')}
            </h2>
            <p className="text-white/70 text-sm mt-1">Tap to send a wish now</p>
          </div>
        </motion.div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Saved', value: birthdays.length, emoji: '🎂' },
          { label: 'This Month', value: thisMonth, emoji: '📅' },
          { label: 'Upcoming', value: upcoming.filter((b) => b.days_until <= 7).length, emoji: '⏰' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="text-2xl font-bold font-display">{s.value}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming strip */}
      {upcoming.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold font-display mb-3">Coming Up</h2>
          <UpcomingStrip
            upcoming={upcoming}
            onWish={setWishTarget}
            onSurprise={setSurpriseTarget}
          />
        </div>
      )}

      {/* All birthdays */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold font-display">All Birthdays</h2>
          <Button size="sm" onClick={() => navigate('/birthdays/add')}>
            <Plus size={15} /> Add
          </Button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search birthdays..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-[#FF375F] focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-2xl border transition-all ${showFilters ? 'bg-[#FF375F]/10 border-[#FF375F]/30 text-[#FF375F]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {showFilters && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 mb-4 flex-wrap">
            {['all', 'best_friend', 'friend', 'family', 'colleague'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs border transition-all ${
                  filter === f ? 'bg-[#FF375F]/20 border-[#FF375F]/40 text-[#FF375F]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                }`}
              >
                {f === 'all' ? 'All' : f.replace('_', ' ')}
              </button>
            ))}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/50"
            >
              <option value="upcoming">Sort: Upcoming</option>
              <option value="alpha">Sort: A–Z</option>
              <option value="recent">Sort: Recent</option>
            </select>
          </motion.div>
        )}

        {loading ? (
          <div className="py-12"><Loader text="Loading birthdays..." /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">🎂</div>
            <p className="text-white/40 mb-4">
              {search ? 'No results found' : 'No birthdays added yet'}
            </p>
            {!search && (
              <Button onClick={() => navigate('/birthdays/add')}>
                <Plus size={16} /> Add your first birthday
              </Button>
            )}
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
            {filtered.map((b, i) => (
              <BirthdayCard
                key={b.id}
                birthday={b}
                index={i}
                onWish={setWishTarget}
                onSurprise={setSurpriseTarget}
                onDelete={deleteBirthday}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <WishGenerator
        birthday={wishTarget}
        isOpen={!!wishTarget}
        onClose={() => setWishTarget(null)}
        onCreateSurprise={(b, msg) => { setSurpriseTarget(b); }}
      />
      <SurpriseBuilder
        birthday={surpriseTarget}
        isOpen={!!surpriseTarget}
        onClose={() => setSurpriseTarget(null)}
      />
    </motion.div>
  );
}
