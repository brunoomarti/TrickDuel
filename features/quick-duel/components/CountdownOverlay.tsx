import React from "react";
import { View, Animated, StyleSheet, ViewStyle } from "react-native";
import { Text } from "@/components/ui/text";

type CountdownOverlayProps = {
    value: 1 | 2 | 3 | null;
    scale: Animated.Value;
    opacity: Animated.Value;
};

export function CountdownOverlay({ value, scale, opacity }: CountdownOverlayProps) {
    if (value === null) return null;

    return (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
            <Animated.View
                style={{
                    transform: [{ scale }],
                    opacity,
                }}
            >
                <Text className="text-[96px] font-extrabold text-white">
                    {value}
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
