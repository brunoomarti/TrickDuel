import { useEffect, useState } from "react";
import { Question } from "../model/question.types";

export function useMemoryPhase(question: Question | undefined, started: boolean) {
    const [isMemoryPhase, setIsMemoryPhase] = useState(false);
    const [showAnswers, setShowAnswers] = useState(true);

    useEffect(() => {
        if (!question || !started) return;

        const isMemory = question.tipo === "memoria";
        setIsMemoryPhase(isMemory);

        if (isMemory) {
            const third = Math.floor(question.timeLimit / 3) * 1000;

            setShowAnswers(false);

            const timer = setTimeout(() => {
                setShowAnswers(true);
                setIsMemoryPhase(false);
            }, third);

            return () => clearTimeout(timer);
        } else {
            setShowAnswers(true);
        }
    }, [question, started]);

    return { isMemoryPhase, showAnswers };
}