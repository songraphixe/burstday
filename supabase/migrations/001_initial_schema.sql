-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  telegram_chat_id TEXT,
  whatsapp_number TEXT,
  timezone TEXT DEFAULT 'Africa/Accra',
  reminder_advance_days INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relationship types enum
CREATE TYPE relationship_type AS ENUM (
  'best_friend',
  'close_friend',
  'friend',
  'partner',
  'spouse',
  'mother',
  'father',
  'sibling',
  'grandparent',
  'child',
  'cousin',
  'colleague',
  'mentor',
  'client',
  'other'
);

-- Birthdays
CREATE TABLE public.birthdays (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  relationship relationship_type NOT NULL DEFAULT 'friend',
  nickname TEXT,
  notes TEXT,
  favorite_things TEXT[],
  avatar_url TEXT,
  avatar_color TEXT,
  reminder_channels TEXT[] DEFAULT ARRAY['email'],
  reminder_time TIME DEFAULT '08:00:00',
  reminder_advance_days INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  last_reminded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishes
CREATE TABLE public.wishes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  birthday_id UUID REFERENCES public.birthdays(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  tone TEXT DEFAULT 'warm',
  year INTEGER NOT NULL,
  was_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Surprise links
CREATE TABLE public.surprise_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  birthday_id UUID REFERENCES public.birthdays(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  message TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  theme TEXT DEFAULT 'confetti',
  voice_note_url TEXT,
  co_signers JSONB DEFAULT '[]',
  view_count INTEGER DEFAULT 0,
  opened_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Surprise reactions
CREATE TABLE public.surprise_reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  surprise_link_id UUID REFERENCES public.surprise_links(id) ON DELETE CASCADE NOT NULL,
  reaction TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminder logs
CREATE TABLE public.reminder_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  birthday_id UUID REFERENCES public.birthdays(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_birthdays_user_id ON public.birthdays(user_id);
CREATE INDEX idx_birthdays_birth_date ON public.birthdays(birth_date);
CREATE INDEX idx_wishes_birthday_id ON public.wishes(birthday_id);
CREATE INDEX idx_surprise_links_token ON public.surprise_links(token);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthdays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surprise_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surprise_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Birthdays
CREATE POLICY "Users manage own birthdays" ON public.birthdays FOR ALL USING (auth.uid() = user_id);

-- Wishes
CREATE POLICY "Users manage own wishes" ON public.wishes FOR ALL USING (auth.uid() = user_id);

-- Surprise links
CREATE POLICY "Users manage own surprise links" ON public.surprise_links FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view active surprise links" ON public.surprise_links FOR SELECT USING (is_active = TRUE);

-- Reactions
CREATE POLICY "Anyone can insert reactions" ON public.surprise_reactions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can view reactions" ON public.surprise_reactions FOR SELECT USING (TRUE);

-- Reminder logs
CREATE POLICY "Users manage own logs" ON public.reminder_logs FOR ALL USING (auth.uid() = user_id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: get upcoming birthdays
CREATE OR REPLACE FUNCTION get_upcoming_birthdays(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  id UUID,
  name TEXT,
  birth_date DATE,
  relationship relationship_type,
  avatar_url TEXT,
  avatar_color TEXT,
  days_until INTEGER,
  turns_age INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.name,
    b.birth_date,
    b.relationship,
    b.avatar_url,
    b.avatar_color,
    CASE
      WHEN (DATE_PART('month', b.birth_date) > DATE_PART('month', CURRENT_DATE))
        OR (DATE_PART('month', b.birth_date) = DATE_PART('month', CURRENT_DATE)
            AND DATE_PART('day', b.birth_date) >= DATE_PART('day', CURRENT_DATE))
      THEN (
        DATE(DATE_PART('year', CURRENT_DATE)::INT || '-' ||
             LPAD(DATE_PART('month', b.birth_date)::TEXT, 2, '0') || '-' ||
             LPAD(DATE_PART('day', b.birth_date)::TEXT, 2, '0'))
        - CURRENT_DATE
      )::INTEGER
      ELSE (
        DATE((DATE_PART('year', CURRENT_DATE)::INT + 1)::TEXT || '-' ||
             LPAD(DATE_PART('month', b.birth_date)::TEXT, 2, '0') || '-' ||
             LPAD(DATE_PART('day', b.birth_date)::TEXT, 2, '0'))
        - CURRENT_DATE
      )::INTEGER
    END AS days_until,
    (DATE_PART('year', CURRENT_DATE) - DATE_PART('year', b.birth_date))::INTEGER AS turns_age
  FROM public.birthdays b
  WHERE b.user_id = p_user_id
    AND b.is_active = TRUE
  ORDER BY days_until ASC;
END;
$$ LANGUAGE plpgsql;

-- pg_cron setup (run in Supabase SQL Editor after enabling the extension)
-- SELECT cron.schedule('daily-birthday-reminders', '0 7 * * *', $$
--   SELECT net.http_post(
--     url := 'https://your-project.supabase.co/functions/v1/send-reminder',
--     headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'
--   );
-- $$);
