import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

export function useCountdown(skip: boolean) {
    const [countdown, setCountdown] = useState<3 | 2 | 1 | null>(null);
    const [started, setStarted] = useState(false);

    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const lock = useRef(false);

    useEffect(() => {
        // só roda uma vez ao montar
        if (skip || lock.current) return;

        lock.current = true;

        const run = async () => {
            await new Promise((r) => setTimeout(r, 400));

            for (const n of [3, 2, 1] as const) {
                setCountdown(n);

                scale.setValue(0.4);
                opacity.setValue(0);

                await new Promise<void>((resolve) => {
                    Animated.parallel([
                        Animated.timing(scale, {
                            toValue: 1.3,
                            duration: 500,
                            easing: Easing.out(Easing.back(1.4)),
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 1,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                    ]).start(() => resolve());
                });
            }

            setCountdown(null);
            setStarted(true);
        };

        run();

    }, []);

    return { countdown, started, scale, opacity };
}
