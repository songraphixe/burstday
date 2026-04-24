import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, MessageCircle, Send, Edit3 } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ToneSelector from './ToneSelector';
import { generateBirthdayWish, getFallbackWish } from '../../lib/gemini';
import { getAge } from '../../lib/utils';
import { useToast } from '../ui/Toast';

export default function WishGenerator({ birthday, isOpen, onClose, onCreateSurprise }) {
  const [tone, setTone] = useState('warm');
  const [wish, setWish] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const { toast } = useToast();

  const getAlternatives = () => {
    const seen = new Set();
    const alts = [];
    while (alts.length < 2) {
      const w = getFallbackWish(birthday?.name || '', birthday?.relationship || 'friend', tone);
      if (!seen.has(w)) { seen.add(w); alts.push(w); }
      if (seen.size > 10) break;
    }
    return alts;
  };

  const generate = async () => {
    if (!birthday) return;
    setLoading(true);
    try {
      const age = birthday.birth_date ? getAge(birthday.birth_date) : null;
      const result = await generateBirthdayWish({
        name: birthday.name,
        relationship: birthday.relationship,
        tone,
        favThings: birthday.favorite_things || [],
        age,
      });
      setWish(result);
      setGenerated(true);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wish);
    toast('Copied to clipboard!', 'success');
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(wish)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(wish)}`,
      '_blank'
    );
  };

  if (!birthday) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎂</div>
          <div>
            <h2 className="font-bold text-lg font-display">{birthday.name}</h2>
            <p className="text-white/40 text-sm capitalize">{birthday.relationship?.replace(/_/g, ' ')}</p>
          </div>
        </div>

        {/* Tone selector */}
        <div>
          <p className="text-white/40 text-xs mb-2 uppercase tracking-widest">Tone</p>
          <ToneSelector value={tone} onChange={(t) => { setTone(t); setGenerated(false); setWish(''); }} />
        </div>

        {/* Editable wish area */}
        <AnimatePresence mode="wait">
          {generated && (
            <motion.div
              key="wish-editor"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Edit3 size={11} className="text-white/30" />
                <span className="text-white/30 text-xs">Edit before sending</span>
              </div>
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-[#FF375F]/30 text-sm leading-relaxed focus:border-[#FF375F] focus:outline-none resize-none transition-colors italic"
                style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate button */}
        <div className="flex gap-2">
          <Button onClick={generate} loading={loading} className="flex-1">
            {generated ? <><RefreshCw size={16} /> Regenerate</> : '✨ Generate with AI'}
          </Button>
          {generated && wish && (
            <Button variant="secondary" onClick={copyToClipboard} className="px-4">
              <Copy size={16} />
            </Button>
          )}
        </div>

        {/* Share actions */}
        {generated && wish && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <button
              onClick={shareWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm hover:bg-green-500/20 transition-all"
            >
              <MessageCircle size={14} /> WhatsApp
            </button>
            <button
              onClick={shareTelegram}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/20 transition-all"
            >
              <Send size={14} /> Telegram
            </button>
            {onCreateSurprise && (
              <button
                onClick={() => { onClose(); onCreateSurprise(birthday, wish); }}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#FF375F]/10 border border-[#FF375F]/20 text-[#FF375F] text-sm hover:bg-[#FF375F]/20 transition-all"
              >
                🎁 Surprise
              </button>
            )}
          </motion.div>
        )}

        {/* Quick alternatives — always visible */}
        <div>
          <p className="text-white/30 text-xs mb-2 uppercase tracking-widest">Quick picks — tap to use</p>
          <div className="space-y-2">
            {getAlternatives().map((alt, i) => (
              <button
                key={i}
                onClick={() => { setWish(alt); setGenerated(true); }}
                className="w-full text-left p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/8 hover:border-[#FF375F]/20 transition-all"
              >
                <p className="text-white/50 text-xs italic line-clamp-2">"{alt}"</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
