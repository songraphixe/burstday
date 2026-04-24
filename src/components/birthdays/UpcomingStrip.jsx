import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';
import CountdownWidget from './CountdownWidget';
import { getRelationshipEmoji } from '../../lib/utils';

export default function UpcomingStrip({ upcoming, onWish, onSurprise }) {
  const navigate = useNavigate();

  if (!upcoming?.length) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
      {upcoming.slice(0, 8).map((b, i) => (
        <motion.div
          key={b.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0, transition: { delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } }}
          onClick={() => navigate(`/birthdays/${b.id}`)}
          className="glass-card p-4 flex flex-col items-center gap-3 cursor-pointer snap-start shrink-0 w-36 hover:-translate-y-1 transition-transform"
        >
          <Avatar name={b.name} src={b.avatar_url} size="md" />
          <div className="text-center">
            <p className="text-white font-medium text-sm truncate w-full">{b.name}</p>
            <p className="text-white/30 text-xs mb-2">{getRelationshipEmoji(b.relationship)}</p>
            <CountdownWidget birthDate={b.birth_date} />
          </div>
          <div className="flex gap-1 w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onWish?.(b)}
              className="flex-1 py-1 rounded-lg text-xs bg-white/5 hover:bg-[#FFB340]/20 hover:text-[#FFB340] text-white/40 transition-all"
            >
              Wish
            </button>
            <button
              onClick={() => onSurprise?.(b)}
              className="flex-1 py-1 rounded-lg text-xs bg-white/5 hover:bg-[#FF375F]/20 hover:text-[#FF375F] text-white/40 transition-all"
            >
              Link
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
