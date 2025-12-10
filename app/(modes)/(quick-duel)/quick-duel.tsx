import React, { useState, useMemo, useEffect } from "react";
import { View, ActivityIndicator, BackHandler } from "react-native";
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

import { useDispatch } from "react-redux";
import { startQuestion, finishQuestion, resetGame } from "@/store/slices/gameSlice";

import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";

const QUESTIONS_PER_MATCH = 6;

export default function QuickDuelScreen() {
    const router = useRouter();
    const dispatch = useDispatch();

    // Resetamos o estado global sempre que o duelo começa
    useEffect(() => {
        dispatch(resetGame());
    }, []);

    const { questions, loading } = useQuestions();
    const { countdown, started, scale, opacity } = useCountdown(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const current = questions[currentIndex];

    const { isMemoryPhase, showAnswers } = useMemoryPhase(current, started);
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

    // TIMER PRINCIPAL
    const { progress } = useTimer(
        current?.timeLimit ?? 10,
        started,
        () => {
            if (!current) return;

            dispatch(
                finishQuestion({
                    questionId: current.id,
                    correct: false,
                })
            );

            const isLast = currentIndex === QUESTIONS_PER_MATCH - 1;

            if (isLast) {
                router.push("/quick-duel-final");
            } else {
                setCurrentIndex((i) => i + 1);
            }
        },
        currentIndex
    );

    // REGISTRAR TEMPO DE CADA PERGUNTA
    useEffect(() => {
        if (current && started) {
            dispatch(startQuestion());
        }
    }, [currentIndex, started]);

    // STEPS VISUAIS
    const steps = useMemo(() => {
        return Array.from({ length: QUESTIONS_PER_MATCH }, (_, idx) => {
            if (idx < currentIndex)
                return { number: idx + 1, type: "completed" as const };

            if (idx === currentIndex)
                return { number: idx + 1, type: "current" as const };

            return { number: idx + 1, type: "next" as const };
        });
    }, [currentIndex]);

    // MODAL DE SAÍDA
    const [exitModalVisible, setExitModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const onBack = () => {
                setExitModalVisible(true);
                return true;
            };

            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBack
            );

            return () => subscription.remove();
        }, [])
    );

    // ===========================
    //    RENDER
    // ===========================

    return (
        <View className="flex-1 bg-[#EFBA3C]">

            {/* LOADING */}
            {loading && (
                <Center className="flex-1">
                    <ActivityIndicator size="large" />
                    <Text className="mt-3 text-sm">Carregando perguntas...</Text>
                </Center>
            )}

            {/* CONTEÚDO PRINCIPAL */}
            {!loading && current && started && (
                <View className="flex-1 items-center p-6 gap-4 pt-10">

                    {/* STEPS */}
                    <View className="w-full p-6 rounded-2xl bg-white">
                        <StepsBar steps={steps} progress={progress} />
                    </View>

                    {/* PERGUNTA */}
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

                    {/* RESPOSTAS */}
                    {showAnswers && (
                        <AnswersList
                            answers={current.answers}
                            selectedId={selectedAnswerId}
                            onSelect={(id) => {
                                if (!current) return;

                                setSelectedAnswerId(id);

                                const correctId = current.answers.find(a => a.isCorrect)?.id;
                                const isCorrect = id === correctId;

                                dispatch(
                                    finishQuestion({
                                        questionId: current.id,
                                        correct: isCorrect,
                                    })
                                );

                                const isLast = currentIndex === QUESTIONS_PER_MATCH - 1;

                                setTimeout(() => {
                                    if (isLast) {
                                        router.push("/quick-duel-final");
                                    } else {
                                        setCurrentIndex((i) => i + 1);
                                    }
                                    setSelectedAnswerId(null);
                                }, 600);
                            }}
                        />
                    )}
                </View>
            )}

            {/* COUNTDOWN INICIAL */}
            <CountdownOverlay value={countdown} scale={scale} opacity={opacity} />

            {/* MODAL DE SAÍDA */}
            <Modal
                isOpen={exitModalVisible}
                onClose={() => setExitModalVisible(false)}
            >
                <ModalBackdrop />

                <ModalContent className="bg-white rounded-2xl p-6 w-80">
                    <ModalHeader>
                        <Text className="text-xl font-semibold text-center">
                            Sair do duelo?
                        </Text>
                    </ModalHeader>

                    <ModalBody className="mt-2 mb-4">
                        <Text className="text-base opacity-80">
                            Se você sair agora, todo o progresso será perdido.
                        </Text>
                    </ModalBody>

                    <ModalFooter className="flex-row justify-between mt-2">
                        <Button
                            variant="outline"
                            onPress={() => setExitModalVisible(false)}
                            className="flex-1 rounded-lg p-3 w-auto h-fit bg-gray-600"
                        >
                            <ButtonText className="text-center text-white font-bold">
                                Cancelar
                            </ButtonText>
                        </Button>

                        <Button
                            action="negative"
                            className="flex-1 rounded-lg p-3 w-auto h-fit bg-red-600"
                            onPress={() => router.back()}
                        >
                            <ButtonText className="text-white">Sair</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </View>
    );
}
