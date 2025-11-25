import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, Easing, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Box } from "@/components/ui/box";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function GameBackground({ children }: { children: React.ReactNode }) {
    const purpleAnim = useRef(new Animated.Value(0)).current;
    const blueAnim = useRef(new Animated.Value(0)).current;
    const scheme = useColorScheme();
    const isDark = scheme === "dark";

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(purpleAnim, {
                    toValue: 1,
                    duration: 16000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(purpleAnim, {
                    toValue: 0,
                    duration: 16000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(blueAnim, {
                    toValue: 1,
                    duration: 14000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(blueAnim, {
                    toValue: 0,
                    duration: 14000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [purpleAnim, blueAnim]);

    const purpleStyle = {
        transform: [
            {
                translateY: purpleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-40, 20],
                }),
            },
            {
                translateX: purpleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-40, -10],
                }),
            },
        ],
    };

    const blueStyle = {
        transform: [
            {
                translateY: blueAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, -10],
                }),
            },
            {
                translateX: blueAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, -20],
                }),
            },
        ],
    };

    const baseBgColors: [string, string, string] = isDark
        ? ["#050017", "#16072b", "#050017"]
        : ["#f9f5ff", "#ede9fe", "#faf5ff"];

    const purpleColors: [string, string, string] = isDark
        ? [
            "rgba(168,85,247,0.9)",
            "rgba(168,85,247,0.25)",
            "rgba(168,85,247,0)",
        ]
        : [
            "rgba(168,85,247,0.35)",
            "rgba(168,85,247,0.12)",
            "rgba(168,85,247,0)",
        ];

    const blueColors: [string, string, string] = isDark
        ? [
            "rgba(59,130,246,0.9)",
            "rgba(59,130,246,0.25)",
            "rgba(59,130,246,0)",
        ]
        : [
            "rgba(59,130,246,0.30)",
            "rgba(59,130,246,0.10)",
            "rgba(59,130,246,0)",
        ];


    return (
        <Box className="flex-1">
            <LinearGradient
                colors={baseBgColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />

            <AnimatedLinearGradient
                colors={purpleColors}
                locations={[0, 0.45, 1]}
                style={[styles.orb, styles.purpleOrb, purpleStyle]}
            />

            <AnimatedLinearGradient
                colors={blueColors}
                locations={[0, 0.45, 1]}
                style={[styles.orb, styles.blueOrb, blueStyle]}
            />

            <Box className="flex-1 justify-center items-center">{children}</Box>
        </Box>
    );
}

const styles = StyleSheet.create({
    orb: {
        position: "absolute",
        borderRadius: 9999,
    },
    purpleOrb: {
        width: 520,
        height: 520,
        top: -160,
        left: -160,
    },
    blueOrb: {
        width: 420,
        height: 420,
        bottom: -140,
        right: -120,
    },
});