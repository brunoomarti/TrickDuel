import { useEffect, useRef, useState } from "react";

export function useTimer(
    timeLimit: number,
    active: boolean,
    onFinish: () => void,
    resetKey: any
) {
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [progress, setProgress] = useState(0);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const onFinishRef = useRef(onFinish);
    useEffect(() => {
        onFinishRef.current = onFinish;
    }, [onFinish]);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (!active) return;

        setTimeLeft(timeLimit);
        setProgress(0);

        const startedAt = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsed = (Date.now() - startedAt) / 1000;
            const remaining = Math.max(timeLimit - elapsed, 0);
            const pct = Math.min(elapsed / timeLimit, 1);

            setTimeLeft(Math.round(remaining));
            setProgress(pct);
        }, 100);

        timeoutRef.current = setTimeout(() => {
            onFinishRef.current?.();
        }, timeLimit * 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [active, timeLimit, resetKey]);

    return { timeLeft, progress };
}
