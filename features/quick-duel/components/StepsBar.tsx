import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { Step } from "@/components/ui/custom/game-step/step";
import { COLORS } from "@/theme/colors";

export type StepState = {
    number: number;
    type: "completed" | "current" | "next";
};

type StepsBarProps = {
    steps: StepState[];
    progress: number;
};

export function StepsBar({ steps, progress }: StepsBarProps) {
    const scheme = useColorScheme();
    const theme = COLORS[scheme ?? "light"];

    return (
        <View style={styles.row}>
            {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                    <Step
                        type={step.type}
                        progress={
                            step.type === "current"
                                ? progress
                                : step.type === "completed"
                                    ? 1
                                    : 0
                        }
                        colorCompleted={theme.textMuted}
                        colorCurrent={theme.accent}
                        colorNext={theme.border}
                        textColor={theme.textPrimary}
                        overlayTextColor={theme.background}
                    >
                        {step.number}
                    </Step>

                    {index < steps.length - 1 && (
                        <View
                            style={[
                                styles.sep,
                                { backgroundColor: theme.border },
                            ]}
                        />
                    )}
                </React.Fragment>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    sep: {
        flex: 1,
        height: 2,
        borderRadius: 999,
        marginHorizontal: 6,
    },
});
