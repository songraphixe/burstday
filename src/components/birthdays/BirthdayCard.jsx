import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Sparkles, Gift } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Avatar from '../ui/Avatar';
import CountdownWidget from './CountdownWidget';
import RelationshipBadge from './RelationshipBadge';
import { formatDate } from '../../lib/utils';
import { cardVariants } from '../../lib/animations';

export default function BirthdayCard({ birthday, onWish, onSurprise, onDelete, index = 0 }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.05 }}
      className="glass-card p-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      style={{ position: 'relative', zIndex: menuOpen ? 50 : 'auto' }}
      onClick={() => navigate(`/birthdays/${birthday.id}`)}
    >
      <div className="flex items-center gap-3">
        <Avatar name={birthday.name} src={birthday.avatar_url} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-white truncate">{birthday.name}</span>
            <CountdownWidget birthDate={birthday.birth_date} />
          </div>
          <div className="flex items-center gap-2">
            <RelationshipBadge type={birthday.relationship} />
            <span className="text-white/30 text-xs">{formatDate(birthday.birth_date)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onWish?.(birthday)}
            className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-[#FFB340] transition-all"
            title="Generate Wish"
          >
            <Sparkles size={16} />
          </button>
          <button
            onClick={() => onSurprise?.(birthday)}
            className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-[#FF375F] transition-all"
            title="Create Surprise"
          >
            <Gift size={16} />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all"
            >
              <MoreHorizontal size={16} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1 w-36 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                  style={{ background: 'var(--bg-secondary)', zIndex: 100 }}
                >
                  <button
                    onClick={() => { navigate(`/birthdays/${birthday.id}/edit`); setMenuOpen(false); }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    ✏️ Edit
                  </button>
                  <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
                  <button
                    onClick={() => { onDelete?.(birthday.id); setMenuOpen(false); }}
                    className="w-full px-4 py-3 text-left text-sm text-[#FF375F] hover:bg-[#FF375F]/10 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
