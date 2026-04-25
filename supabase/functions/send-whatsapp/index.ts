import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const { birthday, isToday } = await req.json();

  const ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
  const AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
  const FROM = Deno.env.get("TWILIO_WHATSAPP_FROM"); // whatsapp:+14155238886

  const toNumber = birthday.profiles?.whatsapp_number;
  if (!toNumber) {
    return new Response(JSON.stringify({ skipped: true, reason: "no whatsapp number" }));
  }

  // Format: whatsapp:+233201234567
  const to = toNumber.startsWith("whatsapp:") ? toNumber : `whatsapp:${toNumber}`;

  const message = isToday
    ? `🎂 *Burstday Reminder*\n\nToday is *${birthday.name}'s Birthday!* 🎉\n\nOpen the app to send a wish or create a surprise link for them!`
    : `⏰ *Burstday Reminder*\n\n*${birthday.name}'s* birthday is in ${birthday.reminder_advance_days} day(s)!\n\nStart planning something special 🎁`;

  const credentials = btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`);

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: FROM!,
        To: to,
        Body: message,
      }).toString(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Twilio error:", result);
    return new Response(JSON.stringify({ error: result }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, sid: result.sid }));
});
