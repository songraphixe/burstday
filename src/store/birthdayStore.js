import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useBirthdayStore = create((set, get) => ({
  birthdays: [],
  upcoming: [],
  loading: false,

  fetchBirthdays: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('birthdays')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    set({ birthdays: data || [], loading: false });
  },

  fetchUpcoming: async (userId) => {
    const { data } = await supabase.rpc('get_upcoming_birthdays', {
      p_user_id: userId,
      p_days: 365,
    });
    set({ upcoming: data || [] });
  },

  addBirthday: async (birthday) => {
    const { data, error } = await supabase
      .from('birthdays')
      .insert(birthday)
      .select()
      .single();
    if (!error) set({ birthdays: [data, ...get().birthdays] });
    return { data, error };
  },

  updateBirthday: async (id, updates) => {
    const { data, error } = await supabase
      .from('birthdays')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (!error) {
      set({ birthdays: get().birthdays.map((b) => (b.id === id ? data : b)) });
    }
    return { data, error };
  },

  deleteBirthday: async (id) => {
    const { error } = await supabase
      .from('birthdays')
      .update({ is_active: false })
      .eq('id', id);
    if (!error) set({ birthdays: get().birthdays.filter((b) => b.id !== id) });
  },
}));
