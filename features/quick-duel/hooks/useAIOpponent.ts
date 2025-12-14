import { useEffect, useState } from "react";
import type {
    AIProfile,
    OnAIAnswerPayload,
} from "@/features/quick-duel/model/ai.types";
import type { Question } from "@/features/quick-duel/model/question.types";

type Difficulty = "easy" | "medium" | "hard";

type UseAIOpponentParams = {
    question: Question | null;
    difficulty: Difficulty;
    aiProfile: AIProfile | null;
    playerAvgTime: number;
    playerAccuracy: number;
    enabled?: boolean;
    onAIAnswer?: (payload: OnAIAnswerPayload) => void;
};

export function useAIOpponent({
    question,
    difficulty,
    aiProfile,
    playerAvgTime,
    playerAccuracy,
    enabled = true,
    onAIAnswer,
}: UseAIOpponentParams) {
    const [aiThinking, setAIThinking] = useState(false);
    const [aiAnswer, setAIAnswer] =
        useState<Question["answers"][number] | null>(null);
    const [aiCorrect, setAICorrect] = useState<boolean | null>(null);
    const [aiTimeToAnswer, setAiTimeToAnswer] = useState<number | null>(null);

    const getLevelForDifficulty = (): number => {
        if (!aiProfile) return 0;

        switch (difficulty) {
            case "easy":
                return aiProfile.level_easy ?? 1;
            case "medium":
                return aiProfile.level_medium ?? 1;
            case "hard":
                return aiProfile.level_hard ?? 1;
            default:
                return 1;
        }
    };

    const getIAHitChance = (level: number): number => {
        switch (difficulty) {
            case "easy":
                return 0.4 + level * 0.04;
            case "medium":
                return 0.3 + level * 0.035;
            case "hard":
                return 0.2 + level * 0.03;
            default:
                return 0.4;
        }
    };

    const getIATimeToAnswer = (level: number): number => {
        let baseTime = 5.0;

        switch (difficulty) {
            case "easy":
                baseTime = 5.5;
                break;
            case "medium":
                baseTime = 6.0;
                break;
            case "hard":
                baseTime = 6.5;
                break;
        }

        const timeImprovement = level * 0.15;
        const clamped = Math.max(1.5, baseTime - timeImprovement);

        const randomFactor = 0.7 + Math.random() * 0.8;
        const playerFactor = playerAvgTime ? 0.3 + Math.random() * 0.4 : 1.0;

        return clamped * randomFactor * playerFactor;
    };

    useEffect(() => {
        // Se não tiver pergunta OU não estiver habilitado, reseta tudo
        if (!question || !enabled) {
            setAIThinking(false);
            setAIAnswer(null);
            setAICorrect(null);
            setAiTimeToAnswer(null);
            return;
        }

        setAIThinking(true);
        setAIAnswer(null);
        setAICorrect(null);
        setAiTimeToAnswer(null);

        const level = getLevelForDifficulty();
        const hitChance = getIAHitChance(level);
        const timeToAnswer = getIATimeToAnswer(level);

        const correctAnswer = question.answers.find((a) => a.isCorrect);
        if (!correctAnswer) {
            setAIThinking(false);
            return;
        }

        const timeout = setTimeout(() => {
            const willHit = Math.random() < hitChance;

            let chosenAnswer = correctAnswer;
            if (!willHit) {
                const wrongAnswers = question.answers.filter(
                    (a) => !a.isCorrect
                );
                if (wrongAnswers.length > 0) {
                    chosenAnswer =
                        wrongAnswers[
                        Math.floor(Math.random() * wrongAnswers.length)
                        ];
                }
            }

            setAIThinking(false);
            setAIAnswer(chosenAnswer);
            const isCorrect = chosenAnswer.id === correctAnswer.id;
            setAICorrect(isCorrect);
            setAiTimeToAnswer(timeToAnswer);

            onAIAnswer?.({
                aiAnswer: chosenAnswer,
                aiCorrect: isCorrect,
                aiTime: timeToAnswer,
            });
        }, timeToAnswer * 1000);

        return () => clearTimeout(timeout);
    }, [question?.id, enabled, difficulty, aiProfile, playerAvgTime]);

    return {
        aiThinking,
        aiAnswer,
        aiCorrect,
        aiTimeToAnswer,
    };
}
