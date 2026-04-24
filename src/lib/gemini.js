const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const generateBirthdayWish = async ({ name, relationship, tone, favThings, age }) => {
  const relationshipLabels = {
    best_friend: 'best friend',
    close_friend: 'close friend',
    partner: 'romantic partner',
    spouse: 'spouse',
    mother: 'mother',
    father: 'father',
    sibling: 'sibling',
    grandparent: 'grandparent',
    child: 'child',
    cousin: 'cousin',
    colleague: 'work colleague',
    mentor: 'mentor',
    client: 'client',
    friend: 'friend',
    other: 'person',
  };

  const toneGuides = {
    warm: 'heartfelt, warm, and genuine',
    funny: 'funny, witty, and playful with light roasts',
    emotional: 'deeply emotional and touching',
    formal: 'professional and respectful',
    spiritual: 'faith-based, uplifting, and prayerful',
  };

  const favThingsText = favThings?.length ? `They love: ${favThings.join(', ')}.` : '';
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
        generationConfig: { maxOutputTokens: 200, temperature: 0.9 },
      }),
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackWish(name, relationship, tone);
  } catch {
    return getFallbackWish(name, relationship, tone);
  }
};

const getFallbackWish = (name, relationship, tone) => {
  const templates = {
    warm: [
      `${name}, the world is genuinely better with you in it. On this birthday, I hope every moment feels like the best version of a day.`,
      `Today is your day, ${name}. I'm grateful every single year that you exist and that you're in my life.`,
      `${name}, you have a way of making everything feel more alive. Wishing you a birthday that matches the energy you bring to everyone around you.`,
    ],
    funny: [
      `${name}, another year older, still somehow getting away with everything. Respect. Happy birthday.`,
      `Happy birthday, ${name}! You don't look a day older than last year. I mean that in the most honest way possible.`,
      `${name}, they say wisdom comes with age. You must be absolutely overflowing with it by now.`,
    ],
    emotional: [
      `${name}, knowing you has changed me. On your birthday, I just want you to feel exactly how much you mean to the people around you.`,
      `There are people who leave their mark just by existing. You're one of them, ${name}. Happy birthday.`,
      `${name}, some people walk into your life and rearrange everything — in the best way. That's what you did. Happy birthday.`,
    ],
    formal: [
      `Dear ${name}, please accept my warmest congratulations on your birthday. Wishing you continued success and good health.`,
      `${name}, on this occasion of your birthday, I extend my sincerest congratulations and best wishes for the year ahead.`,
    ],
    spiritual: [
      `${name}, may this new year of your life be filled with God's grace, divine favour, and every blessing you've prayed for. Happy birthday.`,
      `${name}, I pray that this birthday marks the beginning of the best chapter of your life. May you be covered in grace and overflow with joy.`,
    ],
  };
  const list = templates[tone] || templates.warm;
  return list[Math.floor(Math.random() * list.length)];
};

export { getFallbackWish };
