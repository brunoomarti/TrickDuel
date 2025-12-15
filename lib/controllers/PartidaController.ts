import { supabase } from "@/lib/supabase";

type SaveQuickDuelPayload = {
    userId: string;

    userScore: number;
    aiScore: number;

    userTimeTotal: number;
    aiTimeTotal: number;

    result: "vitória" | "derrota" | "empate";

    xpGained: number;
};

export const PartidaController = {
    async salvarQuickDuel(payload: SaveQuickDuelPayload) {
        const {
            userId,
            userScore,
            aiScore,
            userTimeTotal,
            aiTimeTotal,
            result,
            xpGained,
        } = payload;

        const { data: partida, error: partidaError } = await supabase
            .from("partidas")
            .insert({
                jogador_id: userId,
                modo: "quick-duel",
                acertos: userScore,
                erros: userScore + aiScore,
                tempo_total: userTimeTotal,
                resultado: result,
                data_partida: new Date().toISOString(),
            })
            .select("*")
            .single();

        if (partidaError) {
            console.error("Erro ao salvar partida:", partidaError);
            throw partidaError;
        }

        const { data: profile, error: profileError } = await supabase
            .from("ai_profiles")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

        if (profileError) {
            console.error("Erro ao buscar perfil da IA:", profileError);
            throw profileError;
        }

        const safeXp = result === "derrota" ? 0 : Math.max(0, Math.floor(xpGained || 0));

        const { error: historyError } = await supabase
            .from("ai_matches_history")
            .insert({
                user_id: userId,
                match_id: partida.id,

                result,
                user_score: userScore,
                ai_score: aiScore,

                user_time_total: Number(userTimeTotal),
                ai_time_total: Number(aiTimeTotal),

                ia_level_easy: profile?.level_easy ?? null,
                ia_level_medium: profile?.level_medium ?? null,
                ia_level_hard: profile?.level_hard ?? null,

                xp_gained: safeXp,
                created_at: new Date().toISOString(),
            });

        if (historyError) {
            console.error("Erro ao salvar histórico:", historyError);
            throw historyError;
        }

        if (safeXp > 0) {
            const { error: xpErr } = await supabase.rpc("add_xp", { p_xp: safeXp });
            if (xpErr) {
                console.error("Erro ao somar XP no profile:", xpErr);
            }
        }

        return partida;
    },

    async getPartidasByUser(userId: string, limit = 5, offset = 0) {
        const { data, error } = await supabase
            .from("ai_matches_history")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        return { data, error };
    },
};
