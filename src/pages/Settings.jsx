import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Trash2, Save, Sun, Moon, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { pageVariants } from '../lib/animations';

export default function Settings() {
  const { user, profile, signOut, updateProfile } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const isLight = theme === 'light';
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [telegramId, setTelegramId] = useState(profile?.telegram_chat_id || '');
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp_number || '');
  const [timezone, setTimezone] = useState(profile?.timezone || 'Africa/Accra');
  const [reminderDays, setReminderDays] = useState(profile?.reminder_advance_days || 1);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast('Image must be under 5MB', 'error'); return; }
    setAvatarUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      await updateProfile({ avatar_url: publicUrl });
      toast('Profile picture updated!', 'success');
    } catch (err) {
      toast(err?.message || 'Upload failed. Try again.', 'error');
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ full_name: fullName, telegram_chat_id: telegramId, whatsapp_number: whatsapp, timezone, reminder_advance_days: reminderDays });
      toast('Profile saved!', 'success');
    } catch (e) {
      toast('Failed to save. Try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPass !== passwordForm.confirm) { toast('Passwords do not match', 'error'); return; }
    if (passwordForm.newPass.length < 6) { toast('Password too short', 'error'); return; }
    setPwLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordForm.newPass });
      if (error) toast(error.message, 'error');
      else { toast('Password updated!', 'success'); setPasswordForm({ current: '', newPass: '', confirm: '' }); }
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    toast('Please contact support to delete your account', 'info');
    setDeleteConfirm(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="max-w-2xl mx-auto px-4 pt-6 pb-24">
      <h1 className="text-2xl font-bold font-display mb-6">Settings</h1>

      {/* Profile section */}
      <section className="glass-card p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-5">
          {/* Clickable avatar with camera overlay */}
          <div className="relative flex-shrink-0">
            <Avatar name={profile?.full_name || user?.email} src={profile?.avatar_url} size="lg" />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              title="Change profile picture"
            >
              {avatarUploading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Camera size={20} className="text-white" />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <div>
            <p className="font-medium">{profile?.full_name || 'User'}</p>
            <p className="text-white/40 text-sm">{user?.email}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="text-[#FF375F] text-xs mt-1 hover:text-[#FF6B2C] transition-colors disabled:opacity-50"
            >
              {avatarUploading ? 'Uploading...' : 'Change photo'}
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#FF375F] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#FF375F] focus:outline-none [color-scheme:dark]"
            >
              {['Africa/Accra', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney'].map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleSaveProfile} loading={saving} size="sm">
            <Save size={15} /> Save Profile
          </Button>
        </div>
      </section>

      {/* Notifications */}
      <section className="glass-card p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Default Advance Days</label>
            <div className="flex gap-2">
              {[0, 1, 3, 7, 14].map((d) => (
                <button
                  key={d}
                  onClick={() => setReminderDays(d)}
                  className={`flex-1 py-2 rounded-xl text-xs border transition-all ${
                    reminderDays === d
                      ? 'bg-[#FF375F]/15 border-[#FF375F]/40 text-white'
                      : 'bg-white/3 border-white/8 text-white/50 hover:border-white/20'
                  }`}
                >
                  {d === 0 ? 'Day of' : `${d}d`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Telegram Bot</label>
            <p className="text-white/30 text-xs mb-2">Message @BurstdayBot on Telegram, type /start, then paste your Chat ID here.</p>
            <input
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              placeholder="Your Telegram Chat ID"
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#FF375F] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">WhatsApp Number</label>
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+233201234567"
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#FF375F] focus:outline-none transition-colors"
            />
          </div>

          <Button onClick={handleSaveProfile} loading={saving} size="sm">
            <Save size={15} /> Save Notifications
          </Button>
        </div>
      </section>

      {/* Security */}
      <section className="glass-card p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">Security</h2>
        <div className="space-y-3">
          <input
            type="password"
            value={passwordForm.newPass}
            onChange={(e) => setPasswordForm((p) => ({ ...p, newPass: e.target.value }))}
            placeholder="New password"
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#FF375F] focus:outline-none transition-colors"
          />
          <input
            type="password"
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-[#FF375F] focus:outline-none transition-colors"
          />
          <Button variant="secondary" onClick={handleChangePassword} loading={pwLoading} size="sm">
            Update Password
          </Button>
        </div>
      </section>

      {/* Appearance */}
      <section className="glass-card p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            {isLight ? <Sun size={18} className="text-[#FFB340]" /> : <Moon size={18} className="text-white/50" />}
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {isLight ? 'Light Mode' : 'Dark Mode'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {isLight ? 'Switch to dark for night use' : 'Switch to light for daytime use'}
              </p>
            </div>
          </div>
          <button
            onClick={toggle}
            className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none"
            style={{ background: isLight ? 'linear-gradient(135deg, #FF375F, #FFB340)' : 'rgba(255,255,255,0.15)' }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
              style={{ left: isLight ? '26px' : '2px' }}
            />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {['dark', 'light'].map((t) => (
            <button
              key={t}
              onClick={() => useThemeStore.getState().setTheme(t)}
              className="flex items-center gap-2 p-3 rounded-2xl border transition-all text-sm"
              style={{
                background: theme === t ? 'rgba(255,55,95,0.10)' : 'var(--bg-input)',
                borderColor: theme === t ? 'rgba(255,55,95,0.40)' : 'var(--border-subtle)',
                color: theme === t ? '#FF375F' : 'var(--text-muted)',
              }}
            >
              {t === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
              {t === 'dark' ? 'Dark' : 'Light'}
              {theme === t && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Account */}
      <section className="glass-card p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <div className="space-y-3">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all text-sm"
          >
            <LogOut size={16} /> Sign out
          </button>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#FF375F]/5 border border-[#FF375F]/20 hover:bg-[#FF375F]/10 text-[#FF375F] transition-all text-sm"
          >
            <Trash2 size={16} /> Delete Account
          </button>
        </div>
      </section>

      <Modal isOpen={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Delete Account?" size="sm">
        <p className="text-white/60 text-sm mb-5">This will permanently delete your account and all your birthdays. This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(false)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDeleteAccount} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </motion.div>
  );
}
