import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const { birthday, isToday } = await req.json();
  const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = birthday.profiles?.telegram_chat_id;

  if (!chatId) return new Response(JSON.stringify({ skipped: true }));

  const message = isToday
    ? `🎂 *Today is ${birthday.name}'s Birthday!*\n\nDon't forget to send a wish. Open Burstday to generate one or create a surprise link.`
    : `⏰ *Heads up!* ${birthday.name}'s birthday is coming up in ${birthday.reminder_advance_days} day(s).\n\nOpen Burstday to prepare something special.`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
  });

  return new Response(JSON.stringify({ success: true }));
});
