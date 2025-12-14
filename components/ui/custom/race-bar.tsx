import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Easing, Text, LayoutChangeEvent, useColorScheme } from "react-native";
import { COLORS } from "@/theme/colors";

type Props = {
    time: number;
    totalTime: number;
    color?: string;
    correct: boolean;
};

export function RaceBar({ time, totalTime, color, correct }: Props) {
    const scheme = useColorScheme() ?? "light";
    const theme = COLORS[scheme];

    const widthAnim = useRef(new Animated.Value(0)).current;
    const numberAnim = useRef(new Animated.Value(0)).current;

    const [displayValue, setDisplayValue] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [badgeWidth, setBadgeWidth] = useState(0);

    const pct = Math.min(time / totalTime, 1);

    useEffect(() => {
        Animated.timing(widthAnim, {
            toValue: pct,
            duration: 900,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();

        Animated.timing(numberAnim, {
            toValue: time,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();

        const id = numberAnim.addListener(({ value }) => {
            setDisplayValue(value);
        });
        return () => numberAnim.removeListener(id);
    }, []);

    const animatedBarWidth = widthAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, containerWidth - badgeWidth - 8],
    });

    return (
        <View>
            <View
                style={{
                    width: "100%",
                    height: 20,
                    justifyContent: "center",
                }}
                onLayout={(e: LayoutChangeEvent) => {
                    setContainerWidth(e.nativeEvent.layout.width);
                }}
            >
                {/* BARRA */}
                <Animated.View
                    style={{
                        height: 14,
                        backgroundColor: color ?? theme.accent,
                        borderRadius: 12,
                        width: animatedBarWidth,
                    }}
                />

                {/* BADGE + TEMPO */}
                <Animated.View
                    style={{
                        position: "absolute",
                        left: animatedBarWidth,
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 6,
                    }}
                    onLayout={(e) => setBadgeWidth(e.nativeEvent.layout.width)}
                >
                    {/* BADGE */}
                    <View
                        style={{
                            paddingHorizontal: 8,
                            paddingVertical: 2.5,
                            borderRadius: 20,
                            backgroundColor: correct
                                ? theme.success
                                : theme.error,
                            marginRight: 6,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 9,
                                color: theme.background,
                                fontWeight: "700",
                                lineHeight: 9,
                            }}
                        >
                            {correct ? "acertou" : "errou"}
                        </Text>
                    </View>

                    {/* TEMPO */}
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: theme.textPrimary,
                        }}
                    >
                        {displayValue.toFixed(1)}
                    </Text>
                </Animated.View>
            </View>
        </View>
    );
}
