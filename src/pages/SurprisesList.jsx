import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import { useToast } from '../components/ui/Toast';
import { pageVariants, cardVariants, staggerContainer } from '../lib/animations';

export default function SurprisesList() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('surprise_links')
      .select('*, birthdays(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setLinks(data || []); setLoading(false); });
  }, [user]);

  const copyLink = (token) => {
    navigator.clipboard.writeText(`${window.location.origin}/surprise/${token}`);
    toast('Link copied!', 'success');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="max-w-3xl mx-auto px-4 pt-6 pb-24">
      <h1 className="text-2xl font-bold font-display mb-6">Surprise Links</h1>

      {loading ? (
        <div className="py-12"><Loader text="Loading surprise links..." /></div>
      ) : links.length === 0 ? (
        <div className="py-16 text-center">
          <div className="text-5xl mb-4">🎁</div>
          <p className="text-white/40">No surprise links created yet.</p>
          <p className="text-white/25 text-sm mt-1">Open a birthday to create one.</p>
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
          {links.map((link, i) => {
            const isExpired = link.expires_at && new Date(link.expires_at) < new Date();
            const url = `${window.location.origin}/surprise/${link.token}`;
            return (
              <motion.div key={link.id} variants={cardVariants} transition={{ delay: i * 0.05 }} className="glass-card p-5">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎉</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{link.birthdays?.name || 'Unknown'}</span>
                      <Badge variant={isExpired ? 'default' : link.is_active ? 'green' : 'default'}>
                        {isExpired ? 'Expired' : link.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="default" className="capitalize">{link.theme}</Badge>
                    </div>
                    <p className="text-white/50 text-xs truncate mb-2">"{link.message?.slice(0, 60)}..."</p>
                    <div className="flex items-center gap-3 text-white/25 text-xs">
                      <span>👁 {link.view_count} views</span>
                      <span>📅 {new Date(link.created_at).toLocaleDateString()}</span>
                      {link.expires_at && <span>⏰ Expires {new Date(link.expires_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => copyLink(link.token)} className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all">
                      <Copy size={14} />
                    </button>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
