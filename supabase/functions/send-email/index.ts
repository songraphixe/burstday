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
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Burstday <reminders@burstday.app>",
      to: [birthday.profiles?.email || ""],
      subject,
      html,
    }),
  });

  return new Response(JSON.stringify({ success: true }));
});
