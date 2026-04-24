import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Edit, Trash2, Sparkles, Gift, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import CountdownWidget from '../components/birthdays/CountdownWidget';
import RelationshipBadge from '../components/birthdays/RelationshipBadge';
import WishGenerator from '../components/wishes/WishGenerator';
import SurpriseBuilder from '../components/surprise/SurpriseBuilder';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { formatDate, formatDateFull, getAge } from '../lib/utils';
import { useBirthdayStore } from '../store/birthdayStore';
import { pageVariants } from '../lib/animations';
import Loader from '../components/ui/Loader';

export default function BirthdayDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteBirthday } = useBirthdayStore();
  const { toast } = useToast();

  const [birthday, setBirthday] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [surpriseLinks, setSurpriseLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishOpen, setWishOpen] = useState(false);
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [{ data: bd }, { data: ws }, { data: sl }] = await Promise.all([
        supabase.from('birthdays').select('*').eq('id', id).single(),
        supabase.from('wishes').select('*').eq('birthday_id', id).order('created_at', { ascending: false }),
        supabase.from('surprise_links').select('*').eq('birthday_id', id).order('created_at', { ascending: false }),
      ]);
      setBirthday(bd);
      setWishes(ws || []);
      setSurpriseLinks(sl || []);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    await deleteBirthday(id);
    toast('Birthday removed', 'info');
    navigate('/dashboard');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!birthday) return <div className="p-8 text-center text-white/40">Birthday not found</div>;

  const age = getAge(birthday.birth_date);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="max-w-2xl mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all">
          <ChevronLeft size={22} />
        </button>
        <span className="flex-1" />
        <button onClick={() => navigate(`/birthdays/${id}/edit`)} className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
          <Edit size={18} />
        </button>
        <button onClick={() => setDeleteConfirm(true)} className="p-2 rounded-xl hover:bg-[#FF375F]/10 text-white/40 hover:text-[#FF375F] transition-all">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Hero card */}
      <div className="glass-card p-6 mb-5 text-center">
        <Avatar name={birthday.name} src={birthday.avatar_url} size="lg" className="mx-auto mb-4" showRing />
        <h1 className="text-3xl font-bold font-display mb-1">{birthday.name}</h1>
        {birthday.nickname && <p className="text-white/40 text-sm mb-2">"{birthday.nickname}"</p>}
        <div className="flex items-center justify-center gap-2 mb-4">
          <RelationshipBadge type={birthday.relationship} />
          {age > 0 && <Badge variant="gold">Turning {age + 1}</Badge>}
        </div>
        <p className="text-white/40 text-sm mb-5">{formatDateFull(birthday.birth_date)}</p>
        <CountdownWidget birthDate={birthday.birth_date} size="lg" />
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-5">
        <Button onClick={() => setWishOpen(true)} className="flex-1">
          <Sparkles size={16} /> Generate Wish
        </Button>
        <Button variant="secondary" onClick={() => setSurpriseOpen(true)} className="flex-1">
          <Gift size={16} /> Create Surprise
        </Button>
      </div>

      {/* Favorite things */}
      {birthday.favorite_things?.length > 0 && (
        <div className="glass-card p-5 mb-4">
          <h3 className="font-semibold mb-3 text-sm text-white/60 uppercase tracking-widest">They love</h3>
          <div className="flex flex-wrap gap-2">
            {birthday.favorite_things.map((t) => (
              <Badge key={t} variant="default">✨ {t}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {birthday.notes && (
        <div className="glass-card p-5 mb-4">
          <h3 className="font-semibold mb-2 text-sm text-white/60 uppercase tracking-widest">Notes</h3>
          <p className="text-white/70 text-sm leading-relaxed">{birthday.notes}</p>
        </div>
      )}

      {/* Wish history */}
      {wishes.length > 0 && (
        <div className="glass-card p-5 mb-4">
          <h3 className="font-semibold mb-4 text-sm text-white/60 uppercase tracking-widest">Wish History</h3>
          <div className="space-y-4">
            {wishes.map((w) => (
              <div key={w.id} className="border-l-2 border-[#FF375F]/40 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-[#FF375F]">{w.year}</span>
                  <Badge variant="default">{w.tone}</Badge>
                  {w.was_sent && <Badge variant="green">Sent</Badge>}
                </div>
                <p className="text-white/60 text-sm italic">"{w.content}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Surprise links */}
      {surpriseLinks.length > 0 && (
        <div className="glass-card p-5 mb-4">
          <h3 className="font-semibold mb-4 text-sm text-white/60 uppercase tracking-widest">Surprise Links</h3>
          <div className="space-y-3">
            {surpriseLinks.map((sl) => (
              <div key={sl.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate font-mono">/surprise/...{sl.token.slice(-8)}</p>
                  <p className="text-white/30 text-xs">{sl.view_count} views · {new Date(sl.created_at).toLocaleDateString()}</p>
                </div>
                <Badge variant={sl.is_active ? 'green' : 'default'}>{sl.is_active ? 'Active' : 'Expired'}</Badge>
                <a
                  href={`/surprise/${sl.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <WishGenerator birthday={birthday} isOpen={wishOpen} onClose={() => setWishOpen(false)} onCreateSurprise={() => { setWishOpen(false); setSurpriseOpen(true); }} />
      <SurpriseBuilder birthday={birthday} isOpen={surpriseOpen} onClose={() => setSurpriseOpen(false)} />

      <Modal isOpen={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Remove Birthday?" size="sm">
        <p className="text-white/60 text-sm mb-5">This will remove {birthday.name} from your list. This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(false)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">Remove</Button>
        </div>
      </Modal>
    </motion.div>
  );
}
