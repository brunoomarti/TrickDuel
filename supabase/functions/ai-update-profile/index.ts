import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Mapeia "facil / medio / dificil" -> "easy / medium / hard"
const normalizeDifficulty = (raw: any): "easy" | "medium" | "hard" => {
  if (!raw) return "easy";

  const d = String(raw).toLowerCase();

  switch (d) {
    case "facil":
    case "easy":
      return "easy";

    case "medio":
    case "medium":
      return "medium";

    case "dificil":
    case "hard":
      return "hard";

    default:
      return "easy";
  }
};

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const payload = await req.json();

    const {
      userId,
      questionId,
      difficulty,
      correct,
      answerTime,
    } = payload;

    if (!userId || !questionId) {
      console.error("Payload inválido:", payload);
      return new Response(JSON.stringify({ error: "Missing userId/questionId" }), {
        status: 400,
      });
    }

    const normalizedDifficulty = normalizeDifficulty(difficulty);

    // 1) Registrar estatística
    const { error: insertError } = await supabase
      .from("ai_question_stats")
      .insert({
        user_id: userId,              // uuid
        question_id: String(questionId), // agora TEXT no banco
        difficulty: normalizedDifficulty,
        correct,
        answer_time: answerTime,
      });

    if (insertError) {
      console.error("Erro ao inserir stats:", insertError);
    }

    // 2) Buscar histórico completo
    const { data: stats, error: statsError } = await supabase
      .from("ai_question_stats")
      .select("*")
      .eq("user_id", userId);

    if (statsError) {
      console.error("Erro ao buscar stats:", statsError);
    }

    const safeStats = Array.isArray(stats) ? stats : [];

    const calc = (target: "easy" | "medium" | "hard") => {
      const arr = safeStats.filter(
        (s) => normalizeDifficulty(s.difficulty) === target
      );

      if (arr.length === 0) return { accuracy: 0, avgTime: 4 };

      const accuracy = arr.filter((s) => s.correct).length / arr.length;
      const avgTime =
        arr.reduce((acc, s) => acc + s.answer_time, 0) / arr.length;

      return { accuracy, avgTime };
    };

    const easy = calc("easy");
    const medium = calc("medium");
    const hard = calc("hard");

    const evolveLevel = (accuracy: number) =>
      Math.min(10, accuracy * 7 + Math.random() * 0.3);

    await supabase.from("ai_profiles").upsert({
      user_id: userId,
      accuracy_easy: easy.accuracy,
      accuracy_medium: medium.accuracy,
      accuracy_hard: hard.accuracy,
      avg_time_easy: easy.avgTime,
      avg_time_medium: medium.avgTime,
      avg_time_hard: hard.avgTime,
      level_easy: evolveLevel(easy.accuracy),
      level_medium: evolveLevel(medium.accuracy),
      level_hard: evolveLevel(hard.accuracy),
      updated_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("FUNCTION ERROR:", err);
    return new Response(JSON.stringify({ error: err.toString() }), {
      status: 500,
    });
  }
});
