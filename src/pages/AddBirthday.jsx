import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useBirthdayStore } from '../store/birthdayStore';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { getRelationshipEmoji, getRelationshipLabel } from '../lib/utils';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  birth_date: z.string().min(1, 'Birthday is required'),
  relationship: z.enum(['best_friend','close_friend','friend','partner','spouse','mother','father','sibling','grandparent','child','cousin','colleague','mentor','client','other']),
  nickname: z.string().optional(),
  notes: z.string().optional(),
  reminder_time: z.string().default('08:00'),
  reminder_advance_days: z.number().min(0).max(365).default(1),
});

const relationships = ['best_friend','close_friend','friend','partner','spouse','mother','father','sibling','grandparent','child','cousin','colleague','mentor','client','other'];

const STEPS = ['Who', 'Birthday', 'Interests', 'Reminders'];

export default function AddBirthday() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuthStore();
  const { addBirthday, updateBirthday } = useBirthdayStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [channels, setChannels] = useState(['email']);
  const [loading, setLoading] = useState(false);
  const [useCustomDays, setUseCustomDays] = useState(false);
  const [customDaysInput, setCustomDaysInput] = useState('');

  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { relationship: 'friend', reminder_time: '08:00', reminder_advance_days: 1 },
  });

  const relationship = watch('relationship');

  useEffect(() => {
    if (isEdit) {
      supabase.from('birthdays').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setValue('name', data.name);
          setValue('birth_date', data.birth_date);
          setValue('relationship', data.relationship);
          setValue('nickname', data.nickname || '');
          setValue('notes', data.notes || '');
          setValue('reminder_time', data.reminder_time?.slice(0, 5) || '08:00');
          setValue('reminder_advance_days', data.reminder_advance_days || 1);
          setTags(data.favorite_things || []);
          setChannels(data.reminder_channels || ['email']);
          const days = data.reminder_advance_days ?? 1;
          if (![0, 1, 7, 14].includes(days)) {
            setUseCustomDays(true);
            setCustomDaysInput(String(days));
          }
        }
      });
    }
  }, [isEdit, id]);

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) setTags([...tags, val]);
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const toggleChannel = (ch) => {
    setChannels((prev) =>
      prev.includes(ch) ? (prev.length > 1 ? prev.filter((c) => c !== ch) : prev) : [...prev, ch]
    );
  };

  // Fields that must be valid before advancing each step
  const stepFields = [['name', 'relationship'], ['birth_date'], [], []];

  const handleContinue = async () => {
    const fields = stepFields[step];
    const valid = fields.length === 0 || await trigger(fields);
    if (valid) setStep(step + 1);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Ensure the user's profile row exists (handles users who signed up
      // before email confirmation was disabled — they have no profile row)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          { id: user.id, full_name: user.user_metadata?.full_name || '' },
          { onConflict: 'id', ignoreDuplicates: true }
        );

      if (profileError) {
        toast(`Profile error: ${profileError.message}`, 'error');
        setLoading(false);
        return;
      }

      const payload = {
        ...data,
        user_id: user.id,
        favorite_things: tags,
        reminder_channels: channels,
      };

      const result = isEdit ? await updateBirthday(id, payload) : await addBirthday(payload);

      if (result.error) {
        toast(result.error.message, 'error');
      } else {
        toast(isEdit ? 'Birthday updated!' : 'Birthday added!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      toast(err?.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (errs) => {
    if (errs.name || errs.relationship) { setStep(0); toast('Please fill in the name and relationship.', 'error'); }
    else if (errs.birth_date) { setStep(1); toast('Please add a birthday date.', 'error'); }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  const suggTags = ['music', 'football', 'fashion', 'cooking', 'travel', 'gaming', 'art', 'books', 'fitness'];

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} className="p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all">
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold font-display">{isEdit ? 'Edit Birthday' : 'Add Birthday'}</h1>
          <p className="text-white/40 text-xs">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #FF375F, #FFB340)' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <AnimatePresence mode="wait">
          {/* Step 0: Who */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Full Name *</label>
                <input
                  {...register('name')}
                  placeholder="e.g. Amara Asante"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#FF375F] focus:outline-none transition-colors"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Nickname (optional)</label>
                <input
                  {...register('nickname')}
                  placeholder="What do you call them?"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#FF375F] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest mb-3 block">Relationship *</label>
                <div className="grid grid-cols-3 gap-2">
                  {relationships.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setValue('relationship', r)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        relationship === r
                          ? 'bg-[#FF375F]/15 border-[#FF375F]/50 text-white'
                          : 'bg-white/3 border-white/8 text-white/50 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="text-lg mb-0.5">{getRelationshipEmoji(r)}</div>
                      <div className="text-xs leading-tight">{getRelationshipLabel(r)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Birthday */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Birthday *</label>
                <input
                  {...register('birth_date')}
                  type="date"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#FF375F] focus:outline-none transition-colors [color-scheme:dark]"
                />
                {errors.birth_date && <p className="text-red-400 text-xs mt-1">{errors.birth_date.message}</p>}
                <p className="text-white/25 text-xs mt-2">Include year for age tracking (optional)</p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">What do they love?</label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add an interest..."
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#FF375F] focus:outline-none text-sm transition-colors"
                  />
                  <button type="button" onClick={addTag} className="p-2.5 rounded-2xl bg-[#FF375F]/20 text-[#FF375F] hover:bg-[#FF375F]/30 transition-all">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((t) => (
                    <span key={t} className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF375F]/15 border border-[#FF375F]/30 text-[#FF375F] text-sm">
                      {t}
                      <button onClick={() => removeTag(t)} className="hover:text-white transition-colors"><X size={12} /></button>
                    </span>
                  ))}
                </div>
                <p className="text-white/25 text-xs mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggTags.filter((s) => !tags.includes(s)).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTags([...tags, s])}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs hover:text-white hover:border-white/20 transition-all"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Personal notes</label>
                <textarea
                  {...register('notes')}
                  placeholder="Anything to remember about them..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#FF375F] focus:outline-none resize-none text-sm transition-colors"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Reminders */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest mb-3 block">Reminder Channels</label>
                <div className="space-y-2">
                  {[
                    { id: 'email', label: 'Email', emoji: '📧', desc: 'Get an email reminder' },
                    { id: 'telegram', label: 'Telegram', emoji: '✈️', desc: 'Message via Telegram bot' },
                    { id: 'whatsapp', label: 'WhatsApp', emoji: '💬', desc: 'WhatsApp notification' },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => toggleChannel(ch.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                        channels.includes(ch.id)
                          ? 'bg-[#FF375F]/10 border-[#FF375F]/30'
                          : 'bg-white/3 border-white/8 hover:border-white/15'
                      }`}
                    >
                      <span className="text-2xl">{ch.emoji}</span>
                      <div>
                        <p className="font-medium text-sm text-white">{ch.label}</p>
                        <p className="text-white/40 text-xs">{ch.desc}</p>
                      </div>
                      <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        channels.includes(ch.id) ? 'bg-[#FF375F] border-[#FF375F]' : 'border-white/20'
                      }`}>
                        {channels.includes(ch.id) && <span className="text-white text-xs">✓</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Reminder Time</label>
                <input
                  {...register('reminder_time')}
                  type="time"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#FF375F] focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="text-white/40 text-xs uppercase tracking-widest mb-3 block">How early to remind?</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
                    { val: 0, label: 'Day of' },
                    { val: 1, label: '1 day' },
                    { val: 7, label: '1 week' },
                    { val: 14, label: '2 weeks' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => { setValue('reminder_advance_days', val); setUseCustomDays(false); setCustomDaysInput(''); }}
                      className={`py-3 rounded-2xl border text-xs text-center transition-all ${
                        !useCustomDays && watch('reminder_advance_days') === val
                          ? 'bg-[#FF375F]/15 border-[#FF375F]/40 text-white'
                          : 'bg-white/3 border-white/8 text-white/50 hover:border-white/20'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {/* Custom days option */}
                <button
                  type="button"
                  onClick={() => { setUseCustomDays(true); setCustomDaysInput(String(watch('reminder_advance_days') ?? '')); }}
                  className={`w-full py-2.5 rounded-2xl border text-xs text-center transition-all ${
                    useCustomDays
                      ? 'bg-[#FF375F]/15 border-[#FF375F]/40 text-[#FF375F]'
                      : 'bg-white/3 border-white/8 text-white/40 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {useCustomDays ? 'Custom days' : '+ Set custom days'}
                </button>
                {useCustomDays && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 flex items-center gap-3"
                  >
                    <input
                      type="number"
                      min="0"
                      max="365"
                      value={customDaysInput}
                      onChange={(e) => {
                        setCustomDaysInput(e.target.value);
                        const v = parseInt(e.target.value, 10);
                        if (!isNaN(v) && v >= 0 && v <= 365) setValue('reminder_advance_days', v);
                      }}
                      placeholder="e.g. 3"
                      className="w-28 px-4 py-2.5 rounded-2xl bg-white/5 border border-[#FF375F]/30 text-white text-sm text-center focus:border-[#FF375F] focus:outline-none transition-colors"
                    />
                    <span className="text-white/40 text-sm">days before the birthday</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={handleContinue} className="flex-1">
              Continue <ChevronRight size={16} />
            </Button>
          ) : (
            <Button type="submit" loading={loading} className="flex-1">
              {isEdit ? 'Save Changes' : 'Add Birthday 🎂'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
