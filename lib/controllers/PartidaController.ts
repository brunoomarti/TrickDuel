import { supabase } from "@/lib/supabase";

export type Partida = {
    jogador_id: string;
    modo: string;
    acertos: number;
    erros: number;
    tempo_total: number;
    resultado: string;
};

export const PartidaController = {
    async savePartida(payload: Partida) {
        const { data, error } = await supabase
            .from("partidas")
            .insert({
                ...payload,
                data_partida: new Date().toISOString(),
            });

        if (error) {
            console.error("Erro ao salvar partida:", error);
        }

        return { data, error };
    },

    async getPartidasByUser(userId: string) {
        const { data, error } = await supabase
            .from("partidas")
            .select("*")
            .eq("jogador_id", userId)
            .order("data_partida", { ascending: false });

        if (error) {
            console.error("Erro ao buscar partidas:", error);
        }

        return { data, error };
    },
};
