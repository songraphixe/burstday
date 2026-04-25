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

  // Fetch birthdays with profile data
  const { data: birthdays, error } = await supabase
    .from("birthdays")
    .select(`*, profiles(full_name, telegram_chat_id, whatsapp_number, timezone)`)
    .eq("is_active", true);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // Fetch user emails from auth.users via admin API
  const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const emailMap: Record<string, string> = {};
  for (const u of users) emailMap[u.id] = u.email ?? "";

  const results = [];

  for (const birthday of birthdays || []) {
    const birthDate = new Date(birthday.birth_date + "T00:00:00");
    const birthMonth = birthDate.getMonth() + 1;
    const birthDay = birthDate.getDate();
    const advanceDays = birthday.reminder_advance_days ?? 1;

    // Check if today matches the reminder trigger date
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + advanceDays);
    const isUpcoming =
      targetDate.getMonth() + 1 === birthMonth &&
      targetDate.getDate() === birthDay;
    const isToday = todayMonth === birthMonth && todayDay === birthDay;

    if (!isToday && !isUpcoming) continue;

    const channels: string[] = birthday.reminder_channels || ["email"];
    const userEmail = emailMap[birthday.user_id] || "";
    const enrichedBirthday = { ...birthday, userEmail };

    const dispatched: string[] = [];

    if (channels.includes("email") && userEmail) {
      await supabase.functions.invoke("send-email", {
        body: { birthday: enrichedBirthday, isToday },
      });
      dispatched.push("email");
    }

    if (channels.includes("telegram") && birthday.profiles?.telegram_chat_id) {
      await supabase.functions.invoke("telegram-notify", {
        body: { birthday, isToday },
      });
      dispatched.push("telegram");
    }

    if (channels.includes("whatsapp") && birthday.profiles?.whatsapp_number) {
      await supabase.functions.invoke("send-whatsapp", {
        body: { birthday, isToday },
      });
      dispatched.push("whatsapp");
    }

    if (dispatched.length > 0) {
      await supabase.from("reminder_logs").insert({
        birthday_id: birthday.id,
        user_id: birthday.user_id,
        channel: dispatched.join(","),
        status: "sent",
      });

      await supabase
        .from("birthdays")
        .update({ last_reminded_at: new Date().toISOString() })
        .eq("id", birthday.id);
    }

    results.push({ name: birthday.name, channels: dispatched, isToday });
  }

  return new Response(JSON.stringify({ success: true, processed: results }), {
    headers: { "Content-Type": "application/json" },
  });
});
