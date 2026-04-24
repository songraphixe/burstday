import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useToast } from '../ui/Toast';

const themes = [
  { id: 'confetti', label: 'Confetti', emoji: '🎉', bg: 'from-[#1a0a1f] to-[#0A0A0F]', accent: '#FF375F' },
  { id: 'gold', label: 'Gold', emoji: '✨', bg: 'from-[#2d1f00] to-[#1a1200]', accent: '#FFB340' },
  { id: 'minimal', label: 'Minimal', emoji: '⬜', bg: 'from-white to-gray-100', accent: '#0A0A0F' },
  { id: 'neon', label: 'Neon', emoji: '⚡', bg: 'from-[#050510] to-[#0a0520]', accent: '#AF52DE' },
];

export default function SurpriseBuilder({ birthday, isOpen, onClose, initialMessage = '' }) {
  const { user, profile } = useAuthStore();
  const { toast } = useToast();
  const [message, setMessage] = useState(initialMessage);
  const [theme, setTheme] = useState('confetti');
  const [coSigners, setCoSigners] = useState([]);
  const [expiry, setExpiry] = useState('never');
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const addCoSigner = () => {
    if (coSigners.length < 3) setCoSigners([...coSigners, { name: '', message: '' }]);
  };

  const updateCoSigner = (i, k, v) => {
    const updated = [...coSigners];
    updated[i][k] = v;
    setCoSigners(updated);
  };

  const removeCoSigner = (i) => setCoSigners(coSigners.filter((_, idx) => idx !== i));

  const getExpiryDate = () => {
    if (expiry === 'never') return null;
    const d = new Date();
    d.setDate(d.getDate() + parseInt(expiry));
    return d.toISOString();
  };

  const handleCreate = async () => {
    if (!message.trim()) { toast('Please write a message', 'error'); return; }
    setLoading(true);

    const { data, error } = await supabase
      .from('surprise_links')
      .insert({
        birthday_id: birthday.id,
        user_id: user.id,
        message,
        sender_name: profile?.full_name || 'Someone special',
        theme,
        co_signers: coSigners.filter((c) => c.name.trim()),
        expires_at: getExpiryDate(),
      })
      .select()
      .single();

    if (error) {
      toast('Failed to create link', 'error');
    } else {
      const url = `${window.location.origin}/surprise/${data.token}`;
      setShareUrl(url);
      toast('Surprise link created!', 'success');
    }
    setLoading(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast('Link copied!', 'success');
  };

  if (!birthday) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={`Surprise for ${birthday.name} 🎁`}>
      <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
        {/* Message */}
        <div>
          <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Your Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Write something heartfelt..."
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#FF375F] focus:outline-none resize-none transition-colors"
          />
          <p className="text-white/20 text-xs mt-1 text-right">{message.length}/500</p>
        </div>

        {/* Theme */}
        <div>
          <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Theme</label>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  theme === t.id
                    ? 'border-[#FF375F] bg-[#FF375F]/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="text-xl mb-1">{t.emoji}</div>
                <div className="text-xs text-white/50">{t.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Co-signers */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-white/40 text-xs uppercase tracking-widest">Co-signers</label>
            {coSigners.length < 3 && (
              <button onClick={addCoSigner} className="text-[#FF375F] text-xs hover:text-[#FF6B2C]">+ Add person</button>
            )}
          </div>
          <div className="space-y-2">
            {coSigners.map((cs, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input
                  value={cs.name}
                  onChange={(e) => updateCoSigner(i, 'name', e.target.value)}
                  placeholder="Name"
                  className="w-1/3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:border-[#FF375F] focus:outline-none"
                />
                <input
                  value={cs.message}
                  onChange={(e) => updateCoSigner(i, 'message', e.target.value)}
                  placeholder="Their message"
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:border-[#FF375F] focus:outline-none"
                />
                <button onClick={() => removeCoSigner(i)} className="text-white/30 hover:text-[#FF375F] pt-2 transition-colors">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Expiry */}
        <div>
          <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Link Expires</label>
          <div className="flex gap-2">
            {['never', '7', '30'].map((e) => (
              <button
                key={e}
                onClick={() => setExpiry(e)}
                className={`flex-1 py-2 rounded-xl text-sm border transition-all ${
                  expiry === e
                    ? 'border-[#FF375F] bg-[#FF375F]/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                }`}
              >
                {e === 'never' ? 'Never' : `${e} days`}
              </button>
            ))}
          </div>
        </div>

        {/* Share URL */}
        {shareUrl ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
            <p className="text-green-400 text-sm font-medium mb-2">Link created!</p>
            <div className="flex gap-2">
              <input
                readOnly value={shareUrl}
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono truncate"
              />
              <button onClick={copyLink} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                <Copy size={14} />
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Check this out! ' + shareUrl)}`, '_blank')}
                className="flex-1 py-2 rounded-xl bg-green-500/20 text-green-400 text-xs hover:bg-green-500/30 transition-all"
              >
                Share on WhatsApp
              </button>
              <button
                onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                className="flex-1 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30 transition-all"
              >
                Share on Telegram
              </button>
            </div>
          </motion.div>
        ) : (
          <Button onClick={handleCreate} loading={loading} className="w-full">
            <Share2 size={16} /> Create Surprise Link
          </Button>
        )}
      </div>
    </Modal>
  );
}
