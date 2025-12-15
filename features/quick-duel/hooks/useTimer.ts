import { useEffect, useRef, useState } from "react";

export function useTimer(
    timeLimit: number,
    active: boolean,
    onFinish: () => void,
    resetKey: any
) {
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [elapsed, setElapsed] = useState(0);
    const [progress, setProgress] = useState(0);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startedAtRef = useRef<number | null>(null);
    const onFinishRef = useRef(onFinish);

    useEffect(() => {
        onFinishRef.current = onFinish;
    }, [onFinish]);

    useEffect(() => {
        // cleanup
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (!active) return;

        startedAtRef.current = Date.now();
        setElapsed(0);
        setTimeLeft(timeLimit);
        setProgress(0);

        intervalRef.current = setInterval(() => {
            if (!startedAtRef.current) return;

            const e = (Date.now() - startedAtRef.current) / 1000;
            const rem = Math.max(timeLimit - e, 0);

            setElapsed(e);
            setTimeLeft(rem);
            setProgress(Math.min(e / Math.max(timeLimit, 0.0001), 1));
        }, 50);

        timeoutRef.current = setTimeout(() => {
            onFinishRef.current?.();
        }, Math.max(0, timeLimit) * 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            intervalRef.current = null;
            timeoutRef.current = null;
        };
    }, [active, timeLimit, resetKey]);

    const timeLeftInt = Math.ceil(timeLeft);

    return { timeLeft, timeLeftInt, elapsed, progress, startedAtRef };
}
