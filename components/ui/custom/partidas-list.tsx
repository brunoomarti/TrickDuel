import { useEffect, useState } from "react";
import { View, Text, useColorScheme, Image } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { PartidaController } from "@/lib/controllers/PartidaController";
import { COLORS } from "@/theme/colors";

type Props = {
    userId: string;
};

type Partida = {
    id: number;
    modo: string;
    acertos_usuario: number;
    acertos_ia: number;
    resultado: string;
    data_partida: string;
    user_time_total?: number | null;
    ai_time_total?: number | null;
};

export function PartidasList({ userId }: Props) {
    const PAGE_SIZE = 5;

    const [partidas, setPartidas] = useState<Partida[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const scheme = useColorScheme();
    const theme = COLORS[scheme ?? "light"];

    // -----------------------------
    // Carregamento paginado
    // -----------------------------
    async function carregarPartidas(reset = false) {
        reset ? setLoading(true) : setLoadingMore(true);

        const currentOffset = reset ? 0 : offset;

        const { data, error } =
            await PartidaController.getPartidasByUser(
                userId,
                PAGE_SIZE,
                currentOffset
            );

        if (!error && data) {
            const partidasFormatadas: Partida[] = data.map((p: any) => ({
                id: p.id,
                modo: "Duelo rápido",
                acertos_usuario: p.user_score ?? 0,
                acertos_ia: p.ai_score ?? 0,
                resultado: p.result,
                data_partida: String(p.created_at ?? ""),
                user_time_total: p.user_time_total ?? null,
                ai_time_total: p.ai_time_total ?? null,
            }));

            setPartidas(prev =>
                reset ? partidasFormatadas : [...prev, ...partidasFormatadas]
            );

            setOffset(currentOffset + partidasFormatadas.length);
            setHasMore(partidasFormatadas.length === PAGE_SIZE);
        }

        setLoading(false);
        setLoadingMore(false);
    }

    useEffect(() => {
        if (userId) {
            carregarPartidas(true);
        }
    }, [userId]);

    function formatarTempo(total: number | null | undefined) {
        if (total === null || total === undefined) return null;
        const n = Number(total);
        if (!Number.isFinite(n) || n < 0) return null;
        return `${n.toFixed(1)}s`;
    }

    // -----------------------------
    // Data normalizada
    // -----------------------------
    function formatarDataNormalizada(value: string) {
        if (!value) return "";

        const data = new Date(value);
        if (isNaN(data.getTime())) return "";

        const agora = new Date();

        const dataDia = data.toLocaleDateString("pt-BR", {
            timeZone: "America/Sao_Paulo",
        });

        const hojeDia = agora.toLocaleDateString("pt-BR", {
            timeZone: "America/Sao_Paulo",
        });

        const ontem = new Date(agora);
        ontem.setDate(ontem.getDate() - 1);

        const ontemDia = ontem.toLocaleDateString("pt-BR", {
            timeZone: "America/Sao_Paulo",
        });

        const hora = data.toLocaleTimeString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit",
        });

        if (dataDia === hojeDia) return `Hoje ${hora}`;
        if (dataDia === ontemDia) return `Ontem ${hora}`;

        return `${dataDia} ${hora}`;
    }

    return (
        <View
            style={{
                marginTop: 10,
                marginHorizontal: 21,
                padding: 16,
                backgroundColor: theme.cardBackground,
                borderRadius: 16,
            }}
        >
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 12,
                    color: theme.textPrimary,
                }}
            >
                Minhas partidas
            </Text>

            {loading && (
                <Text style={{ color: theme.textSecondary }}>
                    Carregando...
                </Text>
            )}

            {!loading && partidas.length === 0 && (
                <Text style={{ color: theme.textSecondary }}>
                    Você ainda não jogou nenhuma partida.
                </Text>
            )}

            {!loading && (
                <View className="gap-3">
                    {partidas.map((p) => {
                        const resultado = p.resultado?.toLowerCase();
                        const isVitoria = resultado === "vitória" || resultado === "vitoria";
                        const isDerrota = resultado === "derrota";

                        return (
                            <View
                                key={p.id}
                                className="flex-row overflow-hidden rounded-xl"
                                style={{
                                    backgroundColor:
                                        scheme === "dark"
                                            ? theme.backgroundHeader
                                            : "#F5F5F5",
                                }}
                            >
                                <View
                                    className="w-20 items-center justify-center"
                                    style={{
                                        backgroundColor: isVitoria
                                            ? COLORS.primaryColor
                                            : COLORS.secondaryColor
                                    }}
                                >
                                    {isVitoria && (
                                        <Image
                                            source={require("@/assets/images/cavaleiro.png")}
                                            resizeMode="contain"
                                            className="w-16 h-24"
                                        />
                                    )}

                                    {isDerrota && (
                                        <Image
                                            source={require("@/assets/images/bobo_da_corte.png")}
                                            resizeMode="contain"
                                            className="w-16 h-24"
                                        />
                                    )}
                                </View>

                                <View className="flex-1 p-4">
                                    <View className="flex-row justify-between gap-2 items-center">
                                        <Text
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: 16,
                                                color: theme.textPrimary,
                                            }}
                                        >
                                            Modo: {p.modo}
                                        </Text>

                                        <Text
                                            className="text-xs"
                                            style={{ color: theme.textSecondary }}
                                        >
                                            {formatarDataNormalizada(p.data_partida) || "—"}
                                        </Text>
                                    </View>

                                    {isVitoria && (
                                        <View
                                            className="mt-3 h-8 w-full rounded-md flex-row items-center justify-center"
                                            style={{
                                                backgroundColor: `${COLORS.primaryColor}22`,
                                                borderWidth: 1,
                                                borderColor: COLORS.primaryColor,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: scheme === "dark" ? "#FFF7D6" : "#3A2A00",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                🏆 Vitória
                                            </Text>
                                        </View>
                                    )}

                                    {isDerrota && (
                                        <View
                                            className="mt-3 h-8 w-full rounded-md flex-row items-center justify-center"
                                            style={{
                                                backgroundColor: `${COLORS.secondaryColor}22`,
                                                borderWidth: 1,
                                                borderColor: COLORS.secondaryColor,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: scheme === "dark" ? "#F4F1FF" : "#2A1748",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Derrota
                                            </Text>
                                        </View>
                                    )}

                                    <Text
                                        style={{
                                            marginTop: 8,
                                            color: theme.textPrimary,
                                            fontWeight: "600",
                                        }}
                                    >
                                        Acertos
                                    </Text>

                                    <View className="flex-row gap-2 mt-1">
                                        <View className="flex-1 pr-2 border-r border-gray-300 dark:border-gray-700">
                                            <Text style={{ color: theme.textPrimary }}>
                                                Você: {p.acertos_usuario}
                                                {formatarTempo(p.user_time_total) ? (
                                                    <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                                                        {" "}• ⏱ {formatarTempo(p.user_time_total)}
                                                    </Text>
                                                ) : null}
                                            </Text>
                                        </View>

                                        <View className="flex-1 pl-2">
                                            <Text style={{ color: theme.textPrimary }}>
                                                Opo.: {p.acertos_ia}
                                                {formatarTempo(p.ai_time_total) ? (
                                                    <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                                                        {" "}• ⏱ {formatarTempo(p.ai_time_total)}
                                                    </Text>
                                                ) : null}
                                            </Text>
                                        </View>
                                    </View>

                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
            {
                !loading && hasMore && (
                    <View className="mt-2">
                        <Button
                            onPress={() => carregarPartidas(false)}
                            isDisabled={loadingMore}
                            className="rounded-xl"
                        >
                            <ButtonText>
                                {loadingMore ? "Carregando..." : "Carregar mais"}
                            </ButtonText>
                        </Button>
                    </View>
                )
            }
        </View >
    );
}
