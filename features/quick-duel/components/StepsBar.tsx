import React from "react";
import { View, StyleSheet } from "react-native";
import { Step } from "@/components/ui/custom/game-step/step";

export type StepState = {
    number: number;
    type: "completed" | "current" | "next";
};

type StepsBarProps = {
    steps: StepState[];
    progress: number;
};

export function StepsBar({ steps, progress }: StepsBarProps) {
    return (
        <View style={styles.row}>
            {steps.map((step: StepState, index: number) => (
                <React.Fragment key={step.number}>
                    <Step
                        type={step.type}
                        progress={
                            step.type === "completed"
                                ? 1
                                : step.type === "current"
                                    ? progress
                                    : 0
                        }
                    >
                        {step.number}
                    </Step>

                    {index < steps.length - 1 && <View style={styles.sep} />}
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
        backgroundColor: "#D1D5DB",
        marginHorizontal: 6,
    },
});
