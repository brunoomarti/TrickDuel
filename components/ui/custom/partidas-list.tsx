import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { PartidaController } from "@/lib/controllers/PartidaController";

type Props = {
    userId: string;
};

type Partida = {
    id: string;
    modo: string;
    acertos: number;
    erros: number;
    tempo_total: number;
    resultado: string;
    data_partida: string;
};

export function PartidasList({ userId }: Props) {
    const [partidas, setPartidas] = useState<Partida[]>([]);
    const [loading, setLoading] = useState(true);

    async function carregarPartidas() {
        setLoading(true);

        const { data, error } = await PartidaController.getPartidasByUser(userId);

        if (!error && data) {
            setPartidas(data as Partida[]);
        }

        setLoading(false);
    }

    useEffect(() => {
        if (userId) {
            carregarPartidas();
        }
    }, [userId]);

    return (
        <View
            style={{
                marginTop: 10,
                marginHorizontal: 21,
                padding: 16,
                backgroundColor: "#EDEDED",
            }}
            className="rounded-2xl"
        >
            <Text className="text-xl font-bold mb-3 text-slate-800 dark:text-purple-100">
                Minhas partidas
            </Text>

            {loading && (
                <Text className="text-slate-600">Carregando...</Text>
            )}

            {!loading && partidas.length === 0 && (
                <Text className="text-slate-600">
                    Você ainda não jogou nenhuma partida.
                </Text>
            )}

            {!loading && partidas.map((p) => {
                const resultado = p.resultado?.toLowerCase();

                let resultadoLabel = "➖ Resultado indefinido";
                if (resultado === "vitória" || resultado === "vitoria") {
                    resultadoLabel = "🏆 Vitória";
                } else if (resultado === "derrota") {
                    resultadoLabel = "❌ Derrota";
                } else if (resultado === "empate") {
                    resultadoLabel = "➖ Empate";
                }

                return (
                    <View
                        key={p.id}
                        style={{
                            backgroundColor: "#F5F5F5",
                            padding: 16,
                            borderRadius: 12,
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                            Modo: {p.modo}
                        </Text>

                        <Text style={{ marginTop: 4 }}>🟩 Acertos: {p.acertos}</Text>
                        <Text style={{ marginTop: 4 }}>🟥 Erros: {p.erros}</Text>
                        <Text style={{ marginTop: 4 }}>
                            ⏱ Tempo: {p.tempo_total}s
                        </Text>

                        <Text style={{ marginTop: 4 }}>
                            {resultadoLabel}
                        </Text>

                        <Text
                            style={{
                                marginTop: 4,
                                opacity: 0.6,
                                fontSize: 12,
                            }}
                        >
                            {new Date(p.data_partida).toLocaleString("pt-BR")}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}
