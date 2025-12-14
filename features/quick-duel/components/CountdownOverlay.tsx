import React from "react";
import { View, Animated, StyleSheet, ViewStyle, useColorScheme } from "react-native";
import { Text } from "@/components/ui/text";
import { COLORS } from "@/theme/colors";

type CountdownOverlayProps = {
    countdown: 1 | 2 | 3 | null;
    scale: Animated.Value;
    opacity: Animated.Value;
};

export function CountdownOverlay({
    countdown,
    scale,
    opacity,
}: CountdownOverlayProps) {
    const scheme = useColorScheme();
    const theme = COLORS[scheme ?? "light"];

    if (countdown === null) return null;

    return (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
            <Animated.View
                style={{
                    transform: [{ scale }],
                    opacity,
                }}
            >
                <Text
                    style={{
                        fontSize: 96,
                        lineHeight: 110,
                        fontWeight: "900",
                        color: 'white',
                        textAlign: "center",
                    }}
                >
                    {countdown}
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        justifyContent: "center",
        alignItems: "center",
    } as ViewStyle,
});
