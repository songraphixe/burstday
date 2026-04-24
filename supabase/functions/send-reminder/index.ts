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

  const { data: birthdays } = await supabase
    .from("birthdays")
    .select(`*, profiles(full_name, telegram_chat_id, whatsapp_number, timezone)`);

  for (const birthday of birthdays || []) {
    const birthMonth = new Date(birthday.birth_date).getMonth() + 1;
    const birthDay = new Date(birthday.birth_date).getDate();
    const advanceDays = birthday.reminder_advance_days || 1;

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + advanceDays);
    const isUpcoming = targetDate.getMonth() + 1 === birthMonth && targetDate.getDate() === birthDay;
    const isToday = todayMonth === birthMonth && todayDay === birthDay;

    if (isToday || isUpcoming) {
      const channels = birthday.reminder_channels || ["email"];

      if (channels.includes("email")) {
        await supabase.functions.invoke("send-email", { body: { birthday, isToday } });
      }

      if (channels.includes("telegram") && birthday.profiles?.telegram_chat_id) {
        await supabase.functions.invoke("telegram-notify", { body: { birthday, isToday } });
      }

      await supabase.from("reminder_logs").insert({
        birthday_id: birthday.id,
        user_id: birthday.user_id,
        channel: channels.join(","),
        status: "sent",
      });

      await supabase
        .from("birthdays")
        .update({ last_reminded_at: new Date().toISOString() })
        .eq("id", birthday.id);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
