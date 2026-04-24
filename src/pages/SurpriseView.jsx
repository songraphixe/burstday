import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { continuousConfetti, miniConfettiBurst } from '../lib/confetti';
import Loader from '../components/ui/Loader';

const themes = {
  confetti: {
    bg: 'radial-gradient(ellipse at 30% 20%, rgba(255,55,95,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,179,64,0.1) 0%, transparent 50%), #0A0A0F',
    cardBg: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.1)',
    titleColor: 'transparent',
    titleBg: 'linear-gradient(135deg, #FF375F, #FF6B2C, #FFB340)',
    text: 'rgba(255,255,255,0.85)',
    accent: '#FF375F',
  },
  gold: {
    bg: 'radial-gradient(ellipse at center, rgba(255,179,64,0.12) 0%, transparent 70%), #0e0a00',
    cardBg: 'rgba(255,179,64,0.06)',
    border: 'rgba(255,179,64,0.2)',
    titleColor: 'transparent',
    titleBg: 'linear-gradient(135deg, #FFB340, #FF6B2C)',
    text: 'rgba(255,245,220,0.9)',
    accent: '#FFB340',
  },
  minimal: {
    bg: '#FAFAF8',
    cardBg: 'rgba(0,0,0,0.04)',
    border: 'rgba(0,0,0,0.08)',
    titleColor: 'transparent',
    titleBg: 'linear-gradient(135deg, #FF375F, #FFB340)',
    text: 'rgba(10,10,15,0.8)',
    accent: '#FF375F',
  },
  neon: {
    bg: 'radial-gradient(ellipse at top, rgba(175,82,222,0.15) 0%, transparent 60%), #050510',
    cardBg: 'rgba(175,82,222,0.05)',
    border: 'rgba(175,82,222,0.2)',
    titleColor: 'transparent',
    titleBg: 'linear-gradient(135deg, #AF52DE, #FF375F)',
    text: 'rgba(255,255,255,0.85)',
    accent: '#AF52DE',
  },
};

const reactions = ['🥹', '💛', '🔥', '🎉', '❤️', '😭'];

export default function SurpriseView() {
  const { token } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reacted, setReacted] = useState(null);
  const [totalReactions, setTotalReactions] = useState(0);
  const [floaters, setFloaters] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('surprise_links')
        .select('*')
        .eq('token', token)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLink(data);
      setLoading(false);

      // Increment view count
      supabase.from('surprise_links').update({
        view_count: (data.view_count || 0) + 1,
        opened_at: data.opened_at || new Date().toISOString(),
      }).eq('id', data.id);

      // Get reaction count
      const { count } = await supabase
        .from('surprise_reactions')
        .select('*', { count: 'exact', head: true })
        .eq('surprise_link_id', data.id);
      setTotalReactions(count || 0);

      // Generate floating elements
      setFloaters(
        Array.from({ length: 12 }, (_, i) => ({
          id: i,
          emoji: ['🎈', '✨', '🎊', '🌟', '🎁', '💫'][i % 6],
          x: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 4 + Math.random() * 4,
          size: 16 + Math.random() * 20,
        }))
      );

      // Fire confetti
      setTimeout(() => continuousConfetti(4000), 300);
    };

    load();
  }, [token]);

  const handleReact = async (emoji) => {
    if (!link || reacted) return;
    setReacted(emoji);
    setTotalReactions((p) => p + 1);
    miniConfettiBurst({ x: 0.5, y: 0.6 });
    await supabase.from('surprise_reactions').insert({ surprise_link_id: link.id, reaction: emoji });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}>
        <Loader size="lg" text="Preparing something special..." />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#0A0A0F' }}>
        <div className="text-6xl mb-4">🎈</div>
        <h1 className="text-2xl font-bold font-display mb-2 gradient-text">Link not found</h1>
        <p className="text-white/40 text-sm mb-6">This surprise link may have expired or doesn't exist.</p>
        <Link to="/" className="text-[#FF375F] hover:text-[#FF6B2C] text-sm transition-colors">← Back to Burstday</Link>
      </div>
    );
  }

  const theme = themes[link.theme] || themes.confetti;
  const isMinimal = link.theme === 'minimal';
  const coSigners = link.co_signers || [];

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12"
      style={{ background: theme.bg }}
    >
      {/* Floating elements */}
      {floaters.map((f) => (
        <motion.div
          key={f.id}
          initial={{ y: '110vh', x: `${f.x}vw`, opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, 1, 1, 0] }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'linear' }}
          className="fixed pointer-events-none"
          style={{ fontSize: f.size, left: `${f.x}%` }}
        >
          {f.emoji}
        </motion.div>
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="relative w-full max-w-lg rounded-3xl p-8 sm:p-10 shadow-2xl"
        style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, backdropFilter: 'blur(20px)' }}
      >
        {/* Happy Birthday heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5 } }}
          className="text-5xl sm:text-6xl font-bold font-display text-center mb-3"
          style={{
            background: theme.titleBg,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Happy Birthday!
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { delay: 0.7, duration: 0.4 } }}
          className="h-px mb-6 mx-auto w-3/4 rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }}
        />

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.8, duration: 0.6 } }}
          className="text-center text-lg leading-relaxed mb-6 font-medium"
          style={{ color: theme.text }}
        >
          {link.message}
        </motion.p>

        {/* Sender */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.0 } }}
          className="text-center mb-6"
          style={{ color: isMinimal ? 'rgba(10,10,15,0.4)' : 'rgba(255,255,255,0.4)' }}
        >
          <span className="text-sm">— From </span>
          <span className="font-semibold" style={{ color: theme.accent }}>{link.sender_name}</span>
        </motion.div>

        {/* Co-signers */}
        {coSigners.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.1 } }}
            className="space-y-3 mb-6 pt-4"
            style={{ borderTop: `1px solid ${theme.border}` }}
          >
            {coSigners.filter((c) => c.name).map((co, i) => (
              <div key={i} className="text-center">
                <p className="text-sm italic" style={{ color: theme.text }}>"{co.message}"</p>
                <p className="text-xs mt-1" style={{ color: theme.accent }}>— {co.name}</p>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { delay: 1.1, duration: 0.4 } }}
          className="h-px mb-6 mx-auto w-3/4 rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }}
        />

        {/* Reactions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.2 } }}
          className="text-center"
        >
          <p className="text-sm mb-3" style={{ color: isMinimal ? 'rgba(10,10,15,0.5)' : 'rgba(255,255,255,0.4)' }}>
            {reacted ? `You reacted with ${reacted}` : 'Send a reaction back'}
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {reactions.map((emoji) => (
              <AnimatePresence key={emoji} mode="wait">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReact(emoji)}
                  disabled={!!reacted}
                  className={`text-2xl p-2 rounded-xl transition-all ${
                    reacted === emoji
                      ? 'bg-white/20 scale-110'
                      : reacted
                      ? 'opacity-40'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {emoji}
                </motion.button>
              </AnimatePresence>
            ))}
          </div>
          {totalReactions > 0 && (
            <p className="text-xs mt-2" style={{ color: isMinimal ? 'rgba(10,10,15,0.3)' : 'rgba(255,255,255,0.25)' }}>
              {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.5 } }}
        className="mt-8 text-center"
      >
        <Link to="/" className="text-sm" style={{ color: isMinimal ? 'rgba(10,10,15,0.3)' : 'rgba(255,255,255,0.2)' }}>
          Made with <span style={{ color: '#FF375F' }}>Burstday</span> · Create yours →
        </Link>
      </motion.div>
    </div>
  );
}
