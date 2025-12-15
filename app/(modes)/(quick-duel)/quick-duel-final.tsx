import React, { useEffect, useState, useMemo, useRef } from "react";
import { View, ScrollView, Animated, SafeAreaView, useColorScheme } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { resetGame } from "@/store/slices/gameSlice";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { PartidaController } from "@/lib/controllers/PartidaController";
import { RaceBar } from "@/components/ui/custom/race-bar";
import { COLORS } from "@/theme/colors";
import { PrimaryButton } from "@/components/ui/custom/buttons/primary-button";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

type Winner = "player" | "ai" | "draw";

export default function QuickDuelFinalScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const scheme = useColorScheme() ?? "light";
    const theme = COLORS[scheme];

    const results = useSelector((state: RootState) => state.game.results);
    const aiResults = useSelector((state: RootState) => state.game.aiResults);

    const [saving, setSaving] = useState(false);
    const hasSavedRef = useRef(false);

    const scrollY = useRef(new Animated.Value(0)).current;

    const totalCorrect = results.filter((r) => r.correct).length;
    const totalTime = results.reduce((s, r) => s + r.timeSpent, 0);

    const aiCorrect = aiResults.filter((r) => r.correct).length;
    const aiTime = aiResults.reduce((s, r) => s + r.timeSpent, 0);

    const winner: Winner = useMemo(() => {
        if (totalCorrect > aiCorrect) return "player";
        if (totalCorrect < aiCorrect) return "ai";
        if (totalTime < aiTime) return "player";
        if (totalTime > aiTime) return "ai";
        return "draw";
    }, [totalCorrect, aiCorrect, totalTime, aiTime]);

    const xpPotential = results.reduce((s, r) => s + (r.xpEarned ?? 0), 0);

    const xpMultiplier =
        winner === "player" ? 1.2 : winner === "draw" ? 0.6 : 0;

    const xpGained =
        winner === "ai" ? 0 : Math.max(0, Math.round(xpPotential * xpMultiplier));

    const resultLabel =
        winner === "player"
            ? "vitória"
            : winner === "ai"
                ? "derrota"
                : "empate";

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                dispatch(resetGame());
                router.replace("/");
                return true;
            };

            const sub = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );

            return () => sub.remove();
        }, [])
    );

    async function notifyMatchFinished(winner: Winner) {
        let title = "Quick Duel";
        let body = "";

        if (winner === "player") {
            body = "Vitória! Você venceu o duelo 🏆";
        } else if (winner === "ai") {
            body = "Derrota… o oponente levou essa 😈";
        } else {
            body = "Empate! Duelo equilibrado ⚔️";
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger: null,
        });
    }

    useEffect(() => {
        if (hasSavedRef.current) return;
        if (!results.length) return;

        const save = async () => {
            try {
                setSaving(true);

                const { data } = await supabase.auth.getUser();
                if (!data?.user) return;

                await PartidaController.salvarQuickDuel({
                    userId: data.user.id,
                    userScore: totalCorrect,
                    aiScore: aiCorrect,
                    userTimeTotal: totalTime,
                    aiTimeTotal: aiTime,
                    result: resultLabel,
                    xpGained,
                });

                await notifyMatchFinished(winner);

                hasSavedRef.current = true;
            } catch (err) {
                console.error("Erro ao salvar duelo:", err);
            } finally {
                setSaving(false);
            }
        };

        save();
    }, []);

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [200, 140],
        extrapolate: "clamp",
    });

    const headerPadding = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [32, 28],
        extrapolate: "clamp",
    });

    const shadowOpacity = scrollY.interpolate({
        inputRange: [0, 10],
        outputRange: [0, 0.25],
        extrapolate: "clamp",
    });

    const shadowRadius = scrollY.interpolate({
        inputRange: [0, 10],
        outputRange: [0, 6],
        extrapolate: "clamp",
    });

    const elevation = scrollY.interpolate({
        inputRange: [0, 10],
        outputRange: [0, 8],
        extrapolate: "clamp",
    });

    const shadowOffsetY = scrollY.interpolate({
        inputRange: [0, 10],
        outputRange: [0, 4],
        extrapolate: "clamp",
    });

    const headerContentScale = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [1, 0.75],
        extrapolate: "clamp",
    });

    type ResultBadge = {
        bg: string;
        border: string;
        text: string;
        glow?: boolean;
    };

    const badges: Record<Winner, ResultBadge> = {
        player: scheme === "dark"
            ? {
                bg: theme.accent,
                border: theme.accent,
                text: "#FFFFFF",
                glow: true,
            }
            : {
                bg: theme.accent + "22",
                border: theme.accent,
                text: theme.accent,
                glow: false,
            },

        ai: {
            bg: "#ef8c8b22",
            border: "#ef8c8b",
            text: "#ef8c8b",
        },

        draw: {
            bg: theme.border,
            border: theme.textMuted,
            text: theme.textPrimary,
        },
    };

    const badge = badges[winner];

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background,
            }}
        >
            <Animated.View
                style={{
                    height: headerHeight,
                    paddingTop: headerPadding,
                    paddingBottom: 16,
                    paddingHorizontal: 24,
                    backgroundColor: theme.cardBackground,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 20,

                    elevation,
                    shadowColor: "#000",
                    shadowOpacity,
                    shadowRadius,
                    shadowOffset: { width: 0, height: shadowOffsetY },
                }}
            >
                <Animated.View
                    style={{
                        alignItems: "center",
                        transform: [{ scale: headerContentScale }],
                    }}
                >
                    <Text
                        className="text-3xl font-bold"
                        style={{ color: theme.textPrimary }}
                    >
                        Duelo concluído!
                    </Text>

                    <View
                        style={{
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 16,
                            backgroundColor: badge.bg,
                            marginTop: 10,
                            marginBottom: 6,
                            borderWidth: 1,
                            borderColor: badge.border,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: badge.text,
                                fontWeight: "700",
                            }}
                        >
                            {winner === "player"
                                ? "Você venceu!"
                                : winner === "ai"
                                    ? "Você foi derrotado..."
                                    : "Partida acirrada, tivemos um empate..."}
                        </Text>
                    </View>

                    <Text
                        className="text-base mt-2"
                        style={{ color: theme.textPrimary, lineHeight: 16 }}
                    >
                        Você: {totalCorrect} acertos em {totalTime.toFixed(1)}s
                    </Text>

                    <Text
                        className="text-base"
                        style={{ color: theme.textPrimary, lineHeight: 16 }}
                    >
                        Oponente: {aiCorrect} acertos em {aiTime.toFixed(1)}s
                    </Text>

                    <Text style={{ color: theme.textSecondary, marginTop: 6 }}>
                        XP ganho: {xpGained > 0 ? `+${xpGained}` : "0"}
                    </Text>
                </Animated.View>
            </Animated.View>

            <Animated.ScrollView
                style={{
                    flex: 1,
                    backgroundColor: theme.background,
                }}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 80,
                    paddingTop: 20,
                }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <View>
                    {results.map((r, index) => {
                        const ai = aiResults[index];
                        if (!ai) return null;

                        const limit = r.timeLimit ?? 15;

                        return (
                            <View key={index} className="w-full">
                                <Text
                                    className="font-bold"
                                    style={{
                                        lineHeight: 12,
                                        color: theme.textPrimary,
                                    }}
                                >
                                    Questão {index + 1}
                                </Text>

                                <View
                                    className="w-full p-4 rounded-2xl mt-4"
                                    style={{
                                        backgroundColor: theme.cardSurface,
                                        marginBottom: 26,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: "600",
                                            color: theme.textPrimary,
                                        }}
                                    >
                                        Você
                                    </Text>

                                    <RaceBar
                                        time={r.timeSpent}
                                        totalTime={limit}
                                        color={theme.accent}
                                        correct={r.correct}
                                    />

                                    <RaceBar
                                        time={ai.timeSpent}
                                        totalTime={limit}
                                        color={COLORS.primaryColor}
                                        correct={ai.correct}
                                    />

                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: "600",
                                            color: theme.textPrimary,
                                        }}
                                    >
                                        Duelista
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </Animated.ScrollView>

            <View
                style={{
                    padding: 20,
                    position: "absolute",
                    bottom: 28,
                    left: 0,
                    right: 0,
                }}
            >
                <PrimaryButton
                    loading={saving}
                    label={saving ? "Salvando..." : "Ir para o menu"}
                    style={{ elevation: 4 }}
                    onPress={() => {
                        dispatch(resetGame());
                        router.replace("/");
                    }}
                />
            </View>
        </SafeAreaView>
    );
}
