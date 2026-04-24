# BURSTDAY — Complete Build Specification
> "Never forget the people who matter."

This is the complete specification for Claude Code to build Burstday — a birthday reminder and celebration app with an iOS-inspired design. Follow every section precisely. Build the full product, not a prototype.

---

## 1. PROJECT OVERVIEW

**Product:** Burstday  
**Tagline:** Never miss a birthday again.  
**Core Loop:** User adds a birthday → sets reminder channel → receives alert → sends auto-generated wish or surprise link → birthday person opens a beautiful celebration page.

**Platforms:** Web (React + Vite) and Mobile (React Native via Expo) sharing the same Supabase backend.

---

## 2. TECH STACK

### Web
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + custom CSS variables
- **Animations:** Framer Motion
- **Routing:** React Router v6
- **State:** Zustand
- **Forms:** React Hook Form + Zod

### Mobile
- **Framework:** Expo (React Native)
- **Navigation:** Expo Router
- **Styling:** NativeWind (Tailwind for RN)
- **Animations:** React Native Reanimated + Moti

### Backend (Shared)
- **Database + Auth:** Supabase
- **Email:** Resend API
- **Telegram Bot:** Telegraf.js via Supabase Edge Functions
- **WhatsApp:** Twilio WhatsApp API (free tier)
- **AI Wish Generation:** Google Gemini API (free tier)
- **Scheduler:** Supabase pg_cron (built-in)
- **Hosting (Web):** Vercel
- **Hosting (Mobile):** Expo EAS

### Surprise Link Page
- Hosted on the same web app at `/surprise/:token`
- Fully public, no auth required
- Confetti via `canvas-confetti`

---

## 3. ENVIRONMENT VARIABLES

Create a `.env` file at root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_RESEND_API_KEY=your_resend_api_key
VITE_TWILIO_ACCOUNT_SID=your_twilio_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token
VITE_TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_APP_URL=https://burstday.app
```

---

## 4. DESIGN SYSTEM

### Philosophy
iOS-inspired. Smooth. Premium. Like using Apple's best apps — clean glass morphism, fluid transitions, generous whitespace, confident typography. Every interaction should feel satisfying.

### Color Palette
```css
:root {
  /* Primary */
  --burst-pink: #FF375F;
  --burst-orange: #FF6B2C;
  --burst-gold: #FFB340;

  /* Gradient (primary CTA) */
  --burst-gradient: linear-gradient(135deg, #FF375F 0%, #FF6B2C 50%, #FFB340 100%);

  /* Neutrals */
  --bg-primary: #0A0A0F;
  --bg-secondary: #13131A;
  --bg-card: rgba(255, 255, 255, 0.06);
  --bg-card-hover: rgba(255, 255, 255, 0.09);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(255, 255, 255, 0.16);

  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-muted: rgba(255, 255, 255, 0.35);

  /* Glass */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.10);
  --glass-blur: blur(20px);

  /* Status */
  --success: #34C759;
  --warning: #FF9F0A;
  --error: #FF375F;
}
```

### Typography
```css
/* Import in index.html */
@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@300;400;500;600;700&display=swap');

--font-display: 'Clash Display', sans-serif;  /* headings */
--font-body: 'Satoshi', sans-serif;            /* body text */
```

### Spacing Scale
Follow iOS HIG 8pt grid. Use multiples of 8px for all spacing.

### Border Radius
```css
--radius-sm: 10px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-xl: 32px;
--radius-full: 9999px;
```

### Shadows
```css
--shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
--shadow-glow-pink: 0 0 40px rgba(255, 55, 95, 0.3);
--shadow-glow-gold: 0 0 40px rgba(255, 179, 64, 0.3);
```

### Glass Card Component
Every card uses this base style:
```css
.glass-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.glass-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-active);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}
```

### Animations (Framer Motion defaults)
```js
// Page transition
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

// Stagger children
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07 } }
};

// Card entrance
export const cardVariants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};

// Spring bounce
export const springConfig = { type: "spring", stiffness: 400, damping: 28 };
```

---

## 5. FILE STRUCTURE

```
burstday/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── gemini.js
│   │   ├── confetti.js
│   │   └── utils.js
│   ├── store/
│   │   ├── authStore.js
│   │   └── birthdayStore.js
│   ├── hooks/
│   │   ├── useBirthdays.js
│   │   ├── useAuth.js
│   │   └── useCountdown.js
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── ProgressRing.jsx
│   │   │   └── Loader.jsx
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── BottomNav.jsx
│   │   ├── birthdays/
│   │   │   ├── BirthdayCard.jsx
│   │   │   ├── BirthdayForm.jsx
│   │   │   ├── CountdownWidget.jsx
│   │   │   ├── RelationshipBadge.jsx
│   │   │   └── UpcomingStrip.jsx
│   │   ├── wishes/
│   │   │   ├── WishGenerator.jsx
│   │   │   ├── WishPreview.jsx
│   │   │   └── ToneSelector.jsx
│   │   └── surprise/
│   │       ├── ConfettiCanvas.jsx
│   │       ├── SurprisePage.jsx
│   │       └── SurpriseBuilder.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Auth.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AddBirthday.jsx
│   │   ├── BirthdayDetail.jsx
│   │   ├── SurpriseView.jsx
│   │   ├── Settings.jsx
│   │   └── NotFound.jsx
│   └── styles/
│       ├── globals.css
│       ├── animations.css
│       └── components.css
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── functions/
│       ├── send-reminder/
│       │   └── index.ts
│       ├── send-email/
│       │   └── index.ts
│       └── telegram-notify/
│           └── index.ts
├── .env
├── .env.example
├── vite.config.js
├── tailwind.config.js
├── index.html
└── package.json
```

---

## 6. DATABASE SCHEMA

Run this in Supabase SQL Editor:

```sql
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
  favorite_things TEXT[], -- array of tags e.g. ["football", "music", "coding"]
  avatar_url TEXT,
  avatar_color TEXT, -- fallback color for avatar
  reminder_channels TEXT[] DEFAULT ARRAY['email'], -- ['email', 'whatsapp', 'telegram']
  reminder_time TIME DEFAULT '08:00:00',
  reminder_advance_days INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  last_reminded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishes (generated and sent)
CREATE TABLE public.wishes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  birthday_id UUID REFERENCES public.birthdays(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  tone TEXT DEFAULT 'warm', -- warm | funny | emotional | formal | spiritual
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
  theme TEXT DEFAULT 'confetti', -- confetti | gold | minimal | neon
  voice_note_url TEXT,
  co_signers JSONB DEFAULT '[]', -- [{name, message}]
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
  reaction TEXT NOT NULL, -- emoji or short text
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminder logs
CREATE TABLE public.reminder_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  birthday_id UUID REFERENCES public.birthdays(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  channel TEXT NOT NULL, -- email | whatsapp | telegram
  status TEXT NOT NULL, -- sent | failed | pending
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

-- Function: get upcoming birthdays (next 30 days)
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
```

---

## 7. SUPABASE EDGE FUNCTIONS

### Function: send-reminder (`supabase/functions/send-reminder/index.ts`)
This runs on a schedule via pg_cron every morning at 7AM UTC.

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  // Get all active birthdays that match today +/- advance days
  const { data: birthdays } = await supabase
    .from("birthdays")
    .select(`
      *,
      profiles (
        full_name,
        telegram_chat_id,
        whatsapp_number,
        timezone
      )
    `)
    .eq("is_active", true);

  for (const birthday of birthdays || []) {
    const birthMonth = new Date(birthday.birth_date).getMonth() + 1;
    const birthDay = new Date(birthday.birth_date).getDate();
    const advanceDays = birthday.reminder_advance_days || 1;

    // Check if today is within advance days of birthday
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + advanceDays);
    const isUpcoming = targetDate.getMonth() + 1 === birthMonth && targetDate.getDate() === birthDay;
    const isToday = todayMonth === birthMonth && todayDay === birthDay;

    if (isToday || isUpcoming) {
      const channels = birthday.reminder_channels || ["email"];

      // Invoke per-channel functions
      if (channels.includes("email")) {
        await supabase.functions.invoke("send-email", {
          body: { birthday, isToday }
        });
      }

      if (channels.includes("telegram") && birthday.profiles?.telegram_chat_id) {
        await supabase.functions.invoke("telegram-notify", {
          body: { birthday, isToday }
        });
      }

      // Log the reminder
      await supabase.from("reminder_logs").insert({
        birthday_id: birthday.id,
        user_id: birthday.user_id,
        channel: channels.join(","),
        status: "sent"
      });

      // Update last_reminded_at
      await supabase
        .from("birthdays")
        .update({ last_reminded_at: new Date().toISOString() })
        .eq("id", birthday.id);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
});
```

### Function: send-email (`supabase/functions/send-email/index.ts`)

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const { birthday, isToday } = await req.json();
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const APP_URL = Deno.env.get("APP_URL");

  const subject = isToday
    ? `Today is ${birthday.name}'s Birthday!`
    : `${birthday.name}'s Birthday is Coming Up!`;

  const daysText = isToday ? "TODAY" : `in ${birthday.reminder_advance_days} day(s)`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0A0A0F; color: #fff; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
        .logo { font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #FF375F, #FFB340); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 32px; }
        .card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 32px; margin-bottom: 24px; }
        .name { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
        .badge { display: inline-block; background: linear-gradient(135deg, #FF375F, #FFB340); color: white; border-radius: 999px; padding: 6px 16px; font-size: 14px; font-weight: 600; margin-bottom: 16px; }
        .cta { display: inline-block; background: linear-gradient(135deg, #FF375F, #FFB340); color: white; text-decoration: none; border-radius: 16px; padding: 16px 32px; font-weight: 600; font-size: 16px; margin-top: 16px; }
        .footer { color: rgba(255,255,255,0.4); font-size: 13px; text-align: center; margin-top: 32px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Burstday</div>
        <div class="card">
          <div class="badge">${daysText}</div>
          <div class="name">${birthday.name}</div>
          <p style="color: rgba(255,255,255,0.6); font-size: 16px;">
            ${birthday.name}'s birthday is ${daysText.toLowerCase()}. Time to make it memorable.
          </p>
          <a href="${APP_URL}/dashboard" class="cta">Send a Wish or Surprise Link</a>
        </div>
        <div class="footer">You're receiving this because you use Burstday. Manage reminders in your settings.</div>
      </div>
    </body>
    </html>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Burstday <reminders@burstday.app>",
      to: [birthday.profiles.email || ""],
      subject,
      html
    })
  });

  return new Response(JSON.stringify({ success: true }));
});
```

### Function: telegram-notify (`supabase/functions/telegram-notify/index.ts`)

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const { birthday, isToday } = await req.json();
  const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = birthday.profiles.telegram_chat_id;

  const message = isToday
    ? `🎂 *Today is ${birthday.name}'s Birthday!*\n\nDon't forget to send a wish. Open Burstday to generate one or create a surprise link.`
    : `⏰ *Heads up!* ${birthday.name}'s birthday is coming up in ${birthday.reminder_advance_days} day(s).\n\nOpen Burstday to prepare something special.`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown"
    })
  });

  return new Response(JSON.stringify({ success: true }));
});
```

---

## 8. CORE LIBRARY FILES

### `src/lib/supabase.js`
```js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### `src/lib/gemini.js`
```js
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

export const generateBirthdayWish = async ({ name, relationship, tone, favThings, age }) => {
  const relationshipLabels = {
    best_friend: 'best friend',
    partner: 'romantic partner',
    mother: 'mother',
    father: 'father',
    sibling: 'sibling',
    colleague: 'work colleague',
    mentor: 'mentor',
    client: 'client',
    friend: 'friend',
  };

  const toneGuides = {
    warm: 'heartfelt, warm, and genuine',
    funny: 'funny, witty, and playful with light roasts',
    emotional: 'deeply emotional and touching',
    formal: 'professional and respectful',
    spiritual: 'faith-based, uplifting, and prayerful'
  };

  const favThingsText = favThings?.length
    ? `They love: ${favThings.join(', ')}.`
    : '';

  const ageText = age ? `They are turning ${age}.` : '';

  const prompt = `Write a birthday message for ${name}, who is my ${relationshipLabels[relationship] || relationship}.
Tone: ${toneGuides[tone] || 'warm and genuine'}.
${ageText}
${favThingsText}

Rules:
- Maximum 4 sentences
- No generic filler phrases like "wishing you all the best"
- Make it feel personal and specific
- Do not start with "Happy Birthday" — find a more creative opener
- Return ONLY the message text, nothing else`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.9 }
      })
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackWish(name, relationship, tone);
  } catch {
    return getFallbackWish(name, relationship, tone);
  }
};

// Fallback template system (no API needed)
const getFallbackWish = (name, relationship, tone) => {
  const templates = {
    warm: [
      `${name}, the world is genuinely better with you in it. On this birthday, I hope every moment feels like the best version of a day.`,
      `Today is your day, ${name}. I'm grateful every single year that you exist and that you're my ${relationship}.`,
    ],
    funny: [
      `${name}, another year older, still somehow getting away with everything. Respect. Happy birthday.`,
      `Happy birthday, ${name}! You don't look a day older than last year. I mean that in the most honest way possible.`,
    ],
    emotional: [
      `${name}, knowing you has changed me. On your birthday, I just want you to feel exactly how much you mean to the people around you.`,
      `There are people who leave their mark just by existing. You're one of them, ${name}. Happy birthday.`,
    ],
    formal: [
      `Dear ${name}, please accept my warmest congratulations on your birthday. Wishing you continued success and good health.`,
    ],
    spiritual: [
      `${name}, may this new year of your life be filled with God's grace, divine favour, and every blessing you've prayed for. Happy birthday.`,
    ]
  };
  const list = templates[tone] || templates.warm;
  return list[Math.floor(Math.random() * list.length)];
};
```

### `src/lib/confetti.js`
```js
import confetti from 'canvas-confetti';

export const burstConfetti = () => {
  const count = 200;
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

  const fire = (particleRatio, opts) => {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  };

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#FF375F', '#FF6B2C', '#FFB340'] });
  fire(0.2,  { spread: 60, colors: ['#FF375F', '#FFB340', '#FFFFFF'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#FF375F', '#FF6B2C'] });
  fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#FFB340', '#FF6B2C'] });
  fire(0.1,  { spread: 120, startVelocity: 45, colors: ['#FF375F', '#FFFFFF'] });
};

export const continuousConfetti = (duration = 5000) => {
  const animEnd = Date.now() + duration;
  const interval = setInterval(() => {
    const timeLeft = animEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    const particleCount = 50 * (timeLeft / duration);
    confetti({ particleCount, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FF375F', '#FFB340', '#FF6B2C'] });
    confetti({ particleCount, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FF375F', '#FFB340', '#FF6B2C'] });
  }, 250);
};
```

### `src/lib/utils.js`
```js
export const getDaysUntilBirthday = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const diff = nextBirthday - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export const getRelationshipLabel = (type) => ({
  best_friend: 'Best Friend',
  close_friend: 'Close Friend',
  friend: 'Friend',
  partner: 'Partner',
  spouse: 'Spouse',
  mother: 'Mother',
  father: 'Father',
  sibling: 'Sibling',
  grandparent: 'Grandparent',
  child: 'Child',
  cousin: 'Cousin',
  colleague: 'Colleague',
  mentor: 'Mentor',
  client: 'Client',
  other: 'Other'
}[type] || type);

export const getRelationshipEmoji = (type) => ({
  best_friend: '⚡',
  close_friend: '💛',
  friend: '🤝',
  partner: '💞',
  spouse: '💍',
  mother: '🌸',
  father: '🦁',
  sibling: '🧬',
  grandparent: '🌟',
  child: '🌱',
  cousin: '🫂',
  colleague: '💼',
  mentor: '🎓',
  client: '🤝',
  other: '✨'
}[type] || '✨');

export const generateAvatarColor = (name) => {
  const colors = ['#FF375F', '#FF6B2C', '#FFB340', '#34C759', '#007AFF', '#AF52DE', '#FF2D55', '#5856D6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};
```

---

## 9. ZUSTAND STORES

### `src/store/authStore.js`
```js
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      set({ user: session.user, profile, loading: false });
    } else {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        set({ user: session.user, profile });
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
    const { data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    set({ profile: data });
  }
}));
```

### `src/store/birthdayStore.js`
```js
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
      p_days: 365
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
      set({ birthdays: get().birthdays.map(b => b.id === id ? data : b) });
    }
    return { data, error };
  },

  deleteBirthday: async (id) => {
    const { error } = await supabase
      .from('birthdays')
      .update({ is_active: false })
      .eq('id', id);
    if (!error) set({ birthdays: get().birthdays.filter(b => b.id !== id) });
  }
}));
```

---

## 10. PAGES — DETAILED SPECIFICATIONS

### Page 1: Landing Page (`src/pages/Landing.jsx`)

**Purpose:** Convert visitors to signups.

**Sections:**
1. **Hero** — Full viewport. Animated gradient background. Large headline: *"Never forget the people who matter."* Subtext: *"Birthday reminders, AI-generated wishes, and surprise links — all in one app."* Two CTAs: "Get Started Free" (primary gradient button) and "See how it works" (ghost button). Floating birthday card mockup on the right with subtle float animation.

2. **Social Proof Strip** — Horizontal scrolling logos/avatars of "1,200+ people already using Burstday."

3. **Features Grid** — 3-column glass cards:
   - Smart Reminders (email, WhatsApp, Telegram)
   - AI-Generated Wishes (personalized by relationship and tone)
   - Surprise Links (share a beautiful celebration page)
   - Relationship Tagging (best friend to client — we customize)
   - Countdown Widget (days until next birthday)
   - Birthday History (what you sent last year)

4. **Surprise Link Demo** — Live preview of the surprise page embedded in the landing page. Show confetti, message, animation.

5. **CTA Section** — "Start for free. No credit card." with signup form inline.

6. **Footer** — Logo, links, "Made with love in Ghana."

---

### Page 2: Auth Page (`src/pages/Auth.jsx`)

**Design:** Centered glass card on dark gradient background. Toggle between Sign Up and Sign In.

**Sign Up fields:**
- Full Name
- Email
- Password
- Confirm Password

**Sign In fields:**
- Email
- Password

**Also include:**
- "Continue with Google" button (Supabase OAuth)
- Animated logo at top
- Error states with shake animation
- Loading spinner on submit

**Logic:**
```js
// Sign up
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { full_name: fullName } }
});

// Sign in
const { error } = await supabase.auth.signInWithPassword({ email, password });

// Google OAuth
const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
```

---

### Page 3: Dashboard (`src/pages/Dashboard.jsx`)

**Layout:** Sidebar (desktop) + Bottom nav (mobile). Main content area.

**Sections:**

#### A. Header Strip
- "Good morning, Joseph" (time-sensitive greeting)
- Avatar + notification bell
- Date display

#### B. Today's Birthdays Banner
If someone has a birthday today, show a full-width animated banner with confetti edges:
> "Today is Sarah's Birthday! 🎂 Send a wish now."
CTA button opens the wish generator modal.

#### C. Upcoming Birthdays (Horizontal Scroll Strip)
Cards showing next 5 upcoming birthdays. Each card shows:
- Avatar (image or colored initials)
- Name
- Countdown pill: "3 days" (red if <3, yellow if <7, white if further)
- Relationship badge
- Quick action: "Send Wish" / "Create Surprise"

#### D. All Birthdays List
Full searchable, filterable list.
- Search by name
- Filter by relationship type
- Sort by: Upcoming, Recently Added, Alphabetical
- Each row: Avatar, Name, Birthday date, Relationship, Days until, Actions (view, edit, delete)
- Empty state: Illustration + "Add your first birthday" button

#### E. Stats Row
- Total birthdays saved
- Birthdays this month
- Wishes sent this year

---

### Page 4: Add/Edit Birthday (`src/pages/AddBirthday.jsx`)

**Design:** Full-page smooth form with step-by-step feel. Floating labels. Haptic-like input feedback.

**Fields (in order):**

```
Step 1 — Who are they?
- Name (text input, required)
- Relationship type (visual grid selector with icons, required)
- Nickname (optional, "what do you call them?")

Step 2 — Their Birthday
- Date picker (custom styled, month/day/year selectors)
- Birth year (optional — for age tracking)

Step 3 — What do they love?
- Favorite things tags (free input, press enter to add)
  - Suggestions: music, football, fashion, cooking, travel, gaming, art
- Notes / personal notes (optional textarea)

Step 4 — Reminders
- Reminder channels (toggle cards): Email | Telegram | WhatsApp
- Reminder time (time picker)
- How early to remind? (1 day before, 2 days, 1 week, 2 weeks)

Step 5 — Avatar (optional)
- Upload photo
- Or choose generated colored avatar with initials
```

**Progress bar at top showing current step.**

**Validation (Zod schema):**
```js
const birthdaySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  birth_date: z.string().min(1, "Birthday is required"),
  relationship: z.enum(['best_friend','close_friend','friend','partner','spouse','mother','father','sibling','grandparent','child','cousin','colleague','mentor','client','other']),
  nickname: z.string().optional(),
  notes: z.string().optional(),
  favorite_things: z.array(z.string()).optional(),
  reminder_channels: z.array(z.string()).min(1, "Select at least one reminder channel"),
  reminder_time: z.string(),
  reminder_advance_days: z.number().min(0).max(30)
});
```

---

### Page 5: Birthday Detail (`src/pages/BirthdayDetail.jsx`)

**Sections:**

#### A. Hero Card
Large glass card showing:
- Avatar (large, 80px)
- Name (display font, 32px)
- Relationship badge
- Birthday date
- Age (if birth year provided)
- Days until: Giant animated countdown number with "days to go"

#### B. Quick Actions Row
- "Generate Wish" (opens modal)
- "Create Surprise Link" (opens builder)
- "Edit" (navigate to edit form)

#### C. Wish History
Timeline of wishes sent in previous years.
Each entry: year, wish content, tone tag, date sent.

#### D. Surprise Links
List of surprise links created for this person.
Each: preview URL, view count, date created, reactions received.
Status badges: Active / Expired / Opened.

#### E. Danger Zone
Delete birthday (with confirmation modal).

---

### Page 6: Wish Generator Modal (Component)

**Trigger:** "Generate Wish" button anywhere.

**Design:** Bottom sheet on mobile, centered modal on desktop. Smooth slide-up animation.

**Flow:**
1. Show birthday person's name + relationship at top
2. **Tone selector** — 5 horizontal chips:
   - Warm (default)
   - Funny
   - Emotional
   - Formal
   - Spiritual
3. "Generate" button — triggers Gemini API call with loading spinner
4. Show generated wish in a styled text block
5. Actions:
   - "Regenerate" (generate new wish)
   - "Copy to Clipboard"
   - "Send via WhatsApp" (opens deep link)
   - "Send via Telegram" (opens deep link)
   - "Create Surprise Link" (use this wish in a surprise link)
6. Show 3 alternative quick wishes below (from template fallback system)

**WhatsApp deep link format:**
```js
const whatsappLink = `https://wa.me/?text=${encodeURIComponent(wish)}`;
window.open(whatsappLink, '_blank');
```

**Telegram deep link format:**
```js
const telegramLink = `https://t.me/share/url?text=${encodeURIComponent(wish)}`;
window.open(telegramLink, '_blank');
```

---

### Page 7: Surprise Link Builder (`src/components/surprise/SurpriseBuilder.jsx`)

**Design:** Full-screen builder with live preview panel on right (desktop), tabbed on mobile.

**Left Panel — Builder:**

**Fields:**
- Your name (pre-filled from profile)
- Message to birthday person (textarea, 500 char max)
- Theme selector: 4 visual options
  - **Confetti** — colorful dark, particles
  - **Gold** — warm gold tones, elegant
  - **Minimal** — white clean, subtle
  - **Neon** — cyber-inspired glow
- Add co-signers (up to 3 people): name + their message
- Expiry: Never | 7 days | 30 days

**Right Panel — Live Preview:**
Renders the actual SurprisePage component with current inputs. Updates in real-time.

**On Submit:**
```js
const { data } = await supabase
  .from('surprise_links')
  .insert({
    birthday_id: birthdayId,
    user_id: userId,
    message,
    sender_name: profile.full_name,
    theme,
    co_signers: coSigners,
    expires_at: expiryDate
  })
  .select()
  .single();

const shareUrl = `${APP_URL}/surprise/${data.token}`;
// Show share modal with the URL
```

**Share options after creation:**
- Copy link
- WhatsApp share
- Telegram share
- QR Code (generate with `qrcode` npm package)

---

### Page 8: Surprise View Page (`src/pages/SurpriseView.jsx`)

**Route:** `/surprise/:token` — PUBLIC, no auth required.

**This is the hero feature. Build it beautifully.**

**On Load:**
1. Fetch surprise link by token from Supabase
2. If not found or expired: show elegant "Link not found" page
3. If found: trigger confetti burst immediately on mount
4. Increment `view_count`
5. Set `opened_at` if first open

**Page Structure:**

```
Full-screen, no nav, no footer.

[Background: animated gradient matching selected theme]

[Top — floating animated elements: balloons, stars, sparkles using CSS keyframes]

[Center Card — glass morphism, max-width 560px, centered]
  - "Happy Birthday!" in display font (large, gradient text)
  - Birthday person's name
  - Divider
  - Message text (beautiful serif or display font)
  - Sender name: "From [name]"
  - Co-signers section (if any): each with name + their message
  - Divider

[Reaction Section]
  - "Send a reaction back" 
  - 6 emoji buttons: 🥹 💛 🔥 🎉 ❤️ 😭
  - On click: save to surprise_reactions table, trigger mini confetti burst
  - Show total reaction count

[Footer]
  - "Made with Burstday" (subtle, links to landing page)
  - "Create yours →"
```

**Theme implementations:**

*Confetti Theme:*
```css
background: linear-gradient(135deg, #0A0A0F 0%, #1a0a1f 100%);
/* Floating confetti shapes via CSS animation */
```

*Gold Theme:*
```css
background: linear-gradient(135deg, #1a1200 0%, #2d1f00 100%);
/* Gold particles, warm glowing text */
```

*Minimal Theme:*
```css
background: #FAFAF8;
color: #0A0A0F;
/* Clean white, elegant serif */
```

*Neon Theme:*
```css
background: #050510;
/* Neon glow borders, cyber text effects */
```

**Confetti burst on page load (automatic):**
```js
useEffect(() => {
  setTimeout(() => continuousConfetti(4000), 300);
}, []);
```

---

### Page 9: Settings (`src/pages/Settings.jsx`)

**Sections:**

#### Profile
- Full name (editable)
- Profile photo upload
- Email (read-only from auth)

#### Notifications
- Default reminder time
- Default advance days
- Email notifications (toggle)
- Telegram bot setup:
  - Instructions: "Message @BurstdayBot on Telegram, type /start, paste your ID here"
  - Chat ID input field
- WhatsApp number (for Twilio)

#### Account
- Change password
- Delete account (with confirmation)
- Sign out

---

## 11. UI COMPONENT SPECS

### Button (`src/components/ui/Button.jsx`)
```jsx
// Variants: primary | secondary | ghost | danger
// Sizes: sm | md | lg
// States: default | loading | disabled

// Primary: gradient background, white text, shadow-glow on hover
// Secondary: glass background, white text, border
// Ghost: transparent, white text, hover shows subtle bg
// Danger: red gradient

// Loading state: spinner replaces text content
// All buttons: scale(0.97) on active, smooth 200ms transitions
```

### Input (`src/components/ui/Input.jsx`)
```jsx
// Floating label that moves up on focus/fill
// Glass background: rgba(255,255,255,0.05)
// Focus: border becomes gradient (use outline trick)
// Error state: red border + shake animation
// Success state: green check icon on right
```

### Modal (`src/components/ui/Modal.jsx`)
```jsx
// Backdrop: blur(8px) + rgba(0,0,0,0.6)
// Card: glass morphism, rounded-2xl, shadow-card
// Animation: scale from 0.95 to 1, opacity 0 to 1
// Close: X button top-right + backdrop click + Escape key
```

### Toast (`src/components/ui/Toast.jsx`)
```jsx
// Position: top-right on desktop, top-center on mobile
// Types: success (green) | error (red) | info (blue)
// Animation: slide in from top, auto-dismiss after 3s
// Show Burstday logo mark on left side of toast
```

### Avatar (`src/components/ui/Avatar.jsx`)
```jsx
// If photo: circular image
// If no photo: circle with initials, colored by generateAvatarColor(name)
// Sizes: sm (32px) | md (48px) | lg (80px) | xl (120px)
// Has optional online/status ring
```

---

## 12. NAVIGATION STRUCTURE

### Sidebar (Desktop)
```
Logo: "Burstday" (gradient text)

Nav items:
  Dashboard (home icon)
  All Birthdays (cake icon)
  Surprise Links (sparkles icon)
  Settings (gear icon)

Bottom:
  User avatar + name
  Sign out
```

### Bottom Navigation (Mobile)
```
Home | Birthdays | Add (+) | Surprises | Settings
The Add (+) button is centered, elevated, gradient, larger than others.
```

---

## 13. ROUTING

```jsx
// App.jsx routes
<Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/surprise/:token" element={<SurpriseView />} />
  <Route element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/birthdays" element={<Dashboard />} />
      <Route path="/birthdays/add" element={<AddBirthday />} />
      <Route path="/birthdays/:id" element={<BirthdayDetail />} />
      <Route path="/birthdays/:id/edit" element={<AddBirthday />} />
      <Route path="/surprises" element={<SurprisesList />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
  </Route>
  <Route path="*" element={<NotFound />} />
</Routes>

// ProtectedRoute: redirect to /auth if not logged in
// After login: redirect to /dashboard
```

---

## 14. PACKAGE.JSON DEPENDENCIES

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "canvas-confetti": "^1.9.2",
    "framer-motion": "^11.0.0",
    "qrcode": "^1.5.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.0",
    "react-router-dom": "^6.21.0",
    "zustand": "^4.4.7",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "date-fns": "^3.2.0",
    "lucide-react": "^0.312.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "vite": "^5.0.11"
  }
}
```

---

## 15. TAILWIND CONFIG

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      colors: {
        burst: {
          pink: '#FF375F',
          orange: '#FF6B2C',
          gold: '#FFB340',
        },
        bg: {
          primary: '#0A0A0F',
          secondary: '#13131A',
        }
      },
      backgroundImage: {
        'burst-gradient': 'linear-gradient(135deg, #FF375F 0%, #FF6B2C 50%, #FFB340 100%)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    }
  },
  plugins: []
}
```

---

## 16. INDEX.HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Burstday — Never Miss a Birthday Again</title>
  <meta name="description" content="Birthday reminders, AI-generated wishes, and surprise links. Never forget the people who matter." />
  <meta property="og:title" content="Burstday" />
  <meta property="og:description" content="Never miss a birthday again." />
  <meta property="og:image" content="/og-image.png" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

---

## 17. GLOBAL CSS (`src/index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --burst-pink: #FF375F;
  --burst-orange: #FF6B2C;
  --burst-gold: #FFB340;
  --burst-gradient: linear-gradient(135deg, #FF375F 0%, #FF6B2C 50%, #FFB340 100%);
  --bg-primary: #0A0A0F;
  --bg-secondary: #13131A;
  --bg-card: rgba(255, 255, 255, 0.06);
  --bg-card-hover: rgba(255, 255, 255, 0.09);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(255, 255, 255, 0.16);
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-muted: rgba(255, 255, 255, 0.35);
  --glass-blur: blur(20px);
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --font-display: 'Clash Display', sans-serif;
  --font-body: 'Satoshi', sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

/* Selection */
::selection { background: rgba(255, 55, 95, 0.3); }

/* Gradient text utility */
.gradient-text {
  background: var(--burst-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glass card utility */
.glass-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.glass-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-active);
}

/* Gradient border utility */
.gradient-border {
  position: relative;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: var(--burst-gradient);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

/* Focus ring */
*:focus-visible {
  outline: 2px solid var(--burst-pink);
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

## 18. BUILD ORDER (for Claude Code)

Build in this exact sequence:

1. **Setup:** Init Vite + React, install all dependencies, configure Tailwind, set up CSS variables
2. **Supabase:** Run migration SQL, set up edge functions skeleton
3. **Lib files:** supabase.js, gemini.js, confetti.js, utils.js
4. **Stores:** authStore.js, birthdayStore.js
5. **UI Components:** Button, Input, Modal, Toast, Avatar, Badge, Loader
6. **Auth:** Auth page (sign up + sign in + Google OAuth)
7. **Layout:** AppLayout, Sidebar, BottomNav, routing with ProtectedRoute
8. **Dashboard:** Full dashboard page with all 5 sections
9. **Add Birthday:** Multi-step form, all fields, validation
10. **Birthday Detail:** Detail page with wish history and surprise links
11. **Wish Generator:** Modal with Gemini integration + fallback templates
12. **Surprise Builder:** Builder with live preview
13. **Surprise View:** Public celebration page with confetti, reactions, themes
14. **Settings:** All settings sections
15. **Landing Page:** Full marketing page
16. **Polish:** Transitions, loading states, empty states, error states
17. **Supabase Edge Functions:** send-reminder, send-email, telegram-notify
18. **Testing:** Test all flows end-to-end

---

## 19. ADDITIONAL FEATURES TO BUILD AFTER MVP

- **Voice note recording** embedded in surprise links
- **Gift ideas** AI suggestions based on relationship and interests
- **Group surprise** — invite friends to co-sign via their own link
- **Birthday calendar view** — monthly view like Apple Calendar style
- **Streak system** — track how many consecutive years you remembered someone
- **Custom image cards** — download a designed birthday graphic
- **Bulk import** — import birthdays from contacts or CSV
- **PWA support** — installable on phone without app store

---

## 20. DEPLOYMENT

### Web (Vercel)
```bash
npm run build
# Connect GitHub repo to Vercel
# Add all .env variables in Vercel project settings
```

### Supabase Edge Functions
```bash
supabase functions deploy send-reminder
supabase functions deploy send-email
supabase functions deploy telegram-notify
```

### pg_cron Setup (in Supabase SQL Editor)
```sql
-- Run reminder check every day at 7AM UTC
SELECT cron.schedule(
  'daily-birthday-reminders',
  '0 7 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/send-reminder',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'
  );
  $$
);
```

---

*This is the complete specification for Burstday. Build it exactly as described. Prioritize smoothness, beauty, and delight in every interaction. The surprise link page is the hero — make it unforgettable.*
