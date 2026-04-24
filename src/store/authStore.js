import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useBirthdayStore } from './birthdayStore';

const ensureProfile = async (user) => {
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    const { data: created } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      })
      .select()
      .single();
    profile = created;
  }

  return profile;
};

const prefetchBirthdays = (userId) => {
  const { fetchBirthdays, fetchUpcoming } = useBirthdayStore.getState();
  Promise.all([fetchBirthdays(userId), fetchUpcoming(userId)]);
};

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const [profile] = await Promise.all([
        ensureProfile(session.user),
      ]);
      set({ user: session.user, profile, loading: false });
      prefetchBirthdays(session.user.id);
    } else {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await ensureProfile(session.user);
        set({ user: session.user, profile });
        if (event === 'SIGNED_IN') prefetchBirthdays(session.user.id);
      } else {
        set({ user: null, profile: null });
      }
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  updateProfile: async (updates) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    set({ profile: data });
    return data;
  },
}));
