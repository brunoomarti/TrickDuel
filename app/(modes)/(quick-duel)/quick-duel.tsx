import React, { useState, useMemo, useEffect, useRef } from "react";
import { View, ActivityIndicator, BackHandler, useColorScheme } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { QuestionCard } from "@/components/ui/custom/question-card";
import { AnswersList } from "@/components/ui/custom/answers-list";

import { useQuestions } from "@/features/quick-duel/hooks/useQuestions";
import { useCountdown } from "@/features/quick-duel/hooks/useCountdown";
import { useTimer } from "@/features/quick-duel/hooks/useTimer";
import { useMemoryPhase } from "@/features/quick-duel/hooks/useMemoryPhase";

import { StepsBar } from "@/features/quick-duel/components/StepsBar";
import { CountdownOverlay } from "@/features/quick-duel/components/CountdownOverlay";
import { parseRichText } from "@/features/quick-duel/utils/parseRichText";

import * as Notifications from "expo-notifications";

import { useDispatch } from "react-redux";
import {
    startQuestion,
    finishQuestion,
    resetGame,
    registerAIAnswer,
} from "@/store/slices/gameSlice";

import { updateAIProfile } from "@/lib/updateAIProfile";
import { supabase } from "@/lib/supabase";

import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";

import { useAIOpponent } from "@/features/quick-duel/hooks/useAIOpponent";
import type { AIProfile } from "@/features/quick-duel/model/ai.types";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

import { COLORS } from "@/theme/colors";
import { startScreenTransition } from "@/app/_layout";

const QUESTIONS_PER_MATCH = 6;

const mapDifficulty = (raw?: string): "easy" | "medium" | "hard" => {
    const d = (raw ?? "facil").toLowerCase();
    if (d === "dificil" || d === "hard") return "hard";
    if (d === "medio" || d === "medium") return "medium";
    return "easy";
};

const BOBO_TAUNTS = [
    "Já sinto o gosto da vitória 😈",
    "A plateia já sabe quem vai ganhar 🤡",
    "Isso está ficando divertido… pra mim 🎭",
    "Você até tenta, mas o trono já é meu 👑",
    "Continue… adoro desafios fáceis 😏",
];

export default function QuickDuelScreen() {
    const router = useRouter();
    const dispatch = useDispatch();

    // THEME
    const scheme = useColorScheme();
    const theme = COLORS[scheme ?? "light"];

    const [userId, setUserId] = useState<string | null>(null);
    const [aiProfile, setAIProfile] = useState<AIProfile | null>(null);

    const [playerHistory, setPlayerHistory] = useState<
        { correct: boolean; time: number }[]
    >([]);

    const [opponentSelectedId, setOpponentSelectedId] = useState<string | null>(null);
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

    const pendingFinishRef = useRef(false);

    const [lastAnswerCommitted, setLastAnswerCommitted] = useState(false);
    const aiResults = useSelector((state: RootState) => state.game.aiResults);

    useEffect(() => {
        dispatch(resetGame());

        setCurrentIndex(0);
        setSelectedAnswerId(null);
        setOpponentSelectedId(null);
        pendingFinishRef.current = false;
        setLastAnswerCommitted(false);

        setPlayerHistory([]);
    }, [dispatch]);

    useEffect(() => {
        supabase.auth
            .getUser()
            .then(async ({ data }) => {
                if (!data.user) return;

                setUserId(data.user.id);

                const { data: profile } = await supabase
                    .from("ai_profiles")
                    .select("*")
                    .eq("user_id", data.user.id)
                    .maybeSingle();

                setAIProfile((profile as AIProfile) ?? null);
            })
            .catch((err) => console.warn("Erro ao buscar usuário/perfil da IA:", err));
    }, []);

    const { questions, loading } = useQuestions();
    const { countdown, started, scale, opacity } = useCountdown(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const current = questions[currentIndex];

    const { showAnswers } = useMemoryPhase(current, started);

    const playerAvgTime = useMemo(() => {
        if (!playerHistory.length) return 4;
        return playerHistory.reduce((acc, h) => acc + h.time, 0) / playerHistory.length;
    }, [playerHistory]);

    const playerAccuracy = useMemo(() => {
        if (!playerHistory.length) return 0.5;
        return playerHistory.filter((h) => h.correct).length / playerHistory.length;
    }, [playerHistory]);

    const playerScore = playerHistory.filter(h => h.correct).length;
    const aiScore = aiResults.filter(r => r.correct).length;

    const boboIsWinning = aiScore > playerScore;

    async function sendAIEvent(params: { correct: boolean; answerTime: number }) {
        if (!current || !current.id || !userId) return;

        try {
            await updateAIProfile({
                userId,
                questionId: current.id,
                difficulty: current.dificuldade ?? "facil",
                correct: params.correct,
                answerTime: params.answerTime,
            });
        } catch (err) {
            console.warn("Erro ao enviar evento para IA:", err);
        }
    }

    const difficulty = mapDifficulty(current?.dificuldade);

    const iaEnabled =
        !!current &&
        started &&
        (current.tipo === "memoria" ? showAnswers : true);

    useAIOpponent({
        question: current ?? null,
        difficulty,
        aiProfile,
        playerAvgTime,
        playerAccuracy,
        enabled: iaEnabled,
        onAIAnswer: ({ aiAnswer, aiCorrect, aiTime }) => {
            if (opponentSelectedId) return;

            setOpponentSelectedId(aiAnswer.id);

            if (current) {
                dispatch(
                    registerAIAnswer({
                        questionId: current.id,
                        correct: aiCorrect,
                        timeSpent: aiTime,
                    })
                );
            }
        },
    });

    async function notifyBoboTaunt() {
        const phrase =
            BOBO_TAUNTS[Math.floor(Math.random() * BOBO_TAUNTS.length)];

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "O Bobo provoca",
                body: phrase,
            },
            trigger: null,
        });
    }

    const lastTauntTimeRef = useRef<number>(0);
    const tauntCooldownMs = 40_000;

    const commitFinish = async (params: { correct: boolean; answerTime: number }) => {
        if (!current) return;
        if (pendingFinishRef.current) return;

        pendingFinishRef.current = true;

        dispatch(
            finishQuestion({
                questionId: current.id,
                correct: params.correct,
                timeLimit: current.timeLimit,
            })
        );

        setPlayerHistory((prev) => [
            ...prev,
            { correct: params.correct, time: params.answerTime },
        ]);

        await sendAIEvent({
            correct: params.correct,
            answerTime: params.answerTime,
        });

        const isLast = currentIndex === QUESTIONS_PER_MATCH - 1;
        if (isLast) {
            setLastAnswerCommitted(true);
        }
    };

    const { progress } = useTimer(
        current?.timeLimit ?? 10,
        started,
        () => {
            if (!current) return;

            setSelectedAnswerId("__timeout__");

            commitFinish({
                correct: false,
                answerTime: current.timeLimit,
            });
        },
        currentIndex
    );

    useEffect(() => {
        if (current && started) {
            dispatch(startQuestion());
        }
    }, [currentIndex, started, current, dispatch]);

    useEffect(() => {
        if (!started) return;
        if (!boboIsWinning) return;

        const now = Date.now();
        const elapsed = now - lastTauntTimeRef.current;

        const shouldTaunt = Math.random() < 0.25;

        if (shouldTaunt && elapsed > tauntCooldownMs) {
            lastTauntTimeRef.current = now;
            notifyBoboTaunt();
        }
    }, [playerHistory, started, boboIsWinning]);

    const steps = useMemo(() => {
        return Array.from({ length: QUESTIONS_PER_MATCH }, (_, idx) => {
            if (idx < currentIndex) return { number: idx + 1, type: "completed" as const };
            if (idx === currentIndex) return { number: idx + 1, type: "current" as const };
            return { number: idx + 1, type: "next" as const };
        });
    }, [currentIndex]);

    const [exitModalVisible, setExitModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const onBack = () => {
                setExitModalVisible(true);
                return true;
            };

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBack);
            return () => subscription.remove();
        }, [])
    );

    // Reset de seleção quando muda a questão
    useEffect(() => {
        setSelectedAnswerId(null);
        setOpponentSelectedId(null);
        pendingFinishRef.current = false;
        setLastAnswerCommitted(false);
    }, [currentIndex]);

    // Avança quando ambos (player + IA) selecionaram
    useEffect(() => {
        if (!selectedAnswerId || !opponentSelectedId) return;

        const isLast = currentIndex === QUESTIONS_PER_MATCH - 1;

        // Se for a última, só navega depois do commitFinish
        if (isLast && !lastAnswerCommitted) return;

        const t = setTimeout(() => {
            if (isLast) {
                startScreenTransition(
                    (
                        <View
                            className="flex-1 items-center justify-center"
                            style={{ backgroundColor: theme.cardBackground }}
                        >
                            <Text className="text-3xl font-bold" style={{ color: theme.textPrimary }}>
                                Duelo concluído!
                            </Text>
                            <Text className="mt-2 text-base" style={{ color: theme.textSecondary }}>
                                Mostrando resultado do duelo...
                            </Text>
                        </View>
                    ),
                    "/quick-duel-final"
                );
            } else {
                setCurrentIndex((i) => i + 1);
            }
        }, 700);

        return () => clearTimeout(t);
    }, [selectedAnswerId, opponentSelectedId, currentIndex, lastAnswerCommitted, theme]);

    return (
        <View className="flex-1" style={{ backgroundColor: theme.backgroundQuickDuel }}>
            {loading && (
                <Center className="flex-1">
                    <ActivityIndicator size="large" />
                    <Text className="mt-3 text-sm" style={{ color: theme.textPrimary }}>
                        Carregando perguntas...
                    </Text>
                </Center>
            )}

            {!loading && current && started && (
                <View className="flex-1 items-center p-6 gap-3 pt-10">
                    <View
                        className="w-full p-6 rounded-2xl"
                        style={{ backgroundColor: theme.cardBackground }}
                    >
                        <StepsBar steps={steps} progress={progress} />
                    </View>

                    <QuestionCard
                        text={
                            current.tipo === "memoria"
                                ? showAnswers
                                    ? current.dica
                                    : parseRichText(current.textHtml)
                                : parseRichText(current.textHtml)
                        }
                        imageSource={current.imageSource}
                    />

                    {showAnswers && (
                        <AnswersList
                            answers={current.answers}
                            selectedId={selectedAnswerId}
                            opponentId={opponentSelectedId}
                            onSelect={async (id) => {
                                if (!current) return;
                                if (selectedAnswerId) return;

                                setSelectedAnswerId(id);

                                const correctId = current.answers.find((a) => a.isCorrect)?.id;
                                const isCorrect = id === correctId;

                                const answerTime =
                                    typeof progress === "number"
                                        ? current.timeLimit - Math.floor(current.timeLimit * progress)
                                        : current.timeLimit;

                                await commitFinish({
                                    correct: isCorrect,
                                    answerTime,
                                });
                            }}
                        />
                    )}
                </View>
            )}

            {!loading && !started && (
                <CountdownOverlay countdown={countdown} scale={scale} opacity={opacity} />
            )}

            <Modal isOpen={exitModalVisible} onClose={() => setExitModalVisible(false)}>
                <ModalBackdrop />
                <ModalContent
                    className="rounded-2xl p-6 w-80"
                    style={{ backgroundColor: theme.modalBackground }}
                >
                    <ModalHeader>
                        <Text
                            className="text-xl font-semibold text-center"
                            style={{ color: theme.textPrimary }}
                        >
                            Sair do duelo?
                        </Text>
                    </ModalHeader>

                    <ModalBody className="mt-2 mb-4">
                        <Text style={{ color: theme.textSecondary }}>
                            Se você sair agora, todo o progresso será perdido.
                        </Text>
                    </ModalBody>

                    <ModalFooter className="flex-row justify-between mt-2">
                        <Button
                            variant="outline"
                            onPress={() => setExitModalVisible(false)}
                            className="flex-1 rounded-lg p-3 w-auto h-fit"
                            style={{ backgroundColor: theme.modalButtonCancel }}
                        >
                            <ButtonText className="text-center font-bold" style={{ color: theme.textPrimary }}>
                                Cancelar
                            </ButtonText>
                        </Button>

                        <Button
                            action="negative"
                            className="flex-1 rounded-lg p-3 w-auto h-fit"
                            style={{ backgroundColor: theme.modalButtonExit }}
                            onPress={() => {
                                dispatch(resetGame());
                                router.replace("/");
                            }}
                        >
                            <ButtonText style={{ color: theme.background }}>
                                Sair
                            </ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </View>
    );
}
