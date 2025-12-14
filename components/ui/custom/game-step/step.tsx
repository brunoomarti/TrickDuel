import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import MaskedView from "@react-native-masked-view/masked-view";

export type StepType = "completed" | "current" | "next";

interface StepProps {
    type: StepType;
    children: React.ReactNode;
    progress?: number;

    colorCompleted?: string; // preenchimento do completed
    colorCurrent?: string;   // base do current (cinza)
    colorNext?: string;      // borda do next

    textColor?: string;          // texto padrão
    overlayTextColor?: string;   // texto do current (branco)

    style?: ViewStyle;
    textStyle?: TextStyle;
}

const SIZE = 32;
const RADIUS = SIZE / 2;
const CX = SIZE / 2;
const CY = SIZE / 2;

function createWedgePath(progress: number): string | null {
    if (progress <= 0) return null;
    if (progress >= 1) {
        return `
            M ${CX} ${CY}
            m 0 -${RADIUS}
            a ${RADIUS} ${RADIUS} 0 1 1 0 ${SIZE}
            a ${RADIUS} ${RADIUS} 0 1 1 0 -${SIZE}
            Z
        `;
    }

    const startAngle = -90;
    const endAngle = startAngle + progress * 360;
    const rad = (deg: number) => (deg * Math.PI) / 180;

    const x1 = CX + RADIUS * Math.cos(rad(startAngle));
    const y1 = CY + RADIUS * Math.sin(rad(startAngle));
    const x2 = CX + RADIUS * Math.cos(rad(endAngle));
    const y2 = CY + RADIUS * Math.sin(rad(endAngle));

    const largeArcFlag = progress > 0.5 ? 1 : 0;

    return `
        M ${CX} ${CY}
        L ${x1} ${y1}
        A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
    `;
}

export function Step({
    type,
    children,
    progress = 0,

    colorCompleted = "#9CA3AF",
    colorCurrent = "#E5E7EB",
    colorNext = "#9CA3AF",

    textColor = "#111827",
    overlayTextColor = "#FFFFFF",

    style,
    textStyle,
}: StepProps) {
    const normalizedProgress =
        type === "current" ? Math.min(1, Math.max(0, progress)) : 0;

    const wedgePath = createWedgePath(normalizedProgress);

    // Texto: current sempre branco
    const finalTextColor = type === "current" ? overlayTextColor : textColor;

    return (
        <View style={[styles.container, style]}>
            {/* BASE DO CÍRCULO */}
            <Svg width={SIZE} height={SIZE}>
                <Circle
                    cx={CX}
                    cy={CY}
                    r={RADIUS}
                    fill={
                        type === "completed"
                            ? colorCompleted
                            : type === "current"
                                ? colorCurrent
                                : "transparent"
                    }
                    stroke={type === "next" ? colorNext : "transparent"}
                    strokeWidth={type === "next" ? 2 : 0}
                />
            </Svg>

            {/* WEDGE (roxo) aplicado NA BOLA */}
            {type === "current" && wedgePath && (
                <MaskedView
                    style={StyleSheet.absoluteFill}
                    maskElement={
                        <Svg width={SIZE} height={SIZE}>
                            <Path d={wedgePath} fill="white" />
                        </Svg>
                    }
                >
                    <Svg width={SIZE} height={SIZE}>
                        <Circle
                            cx={CX}
                            cy={CY}
                            r={RADIUS}
                            fill={colorCompleted}
                        />
                    </Svg>
                </MaskedView>
            )}

            {/* TEXTO (current sempre branco) */}
            <View style={styles.numberLayer}>
                <Text
                    style={[
                        styles.numberText,
                        { color: finalTextColor },
                        textStyle,
                    ]}
                >
                    {children}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: SIZE,
        height: SIZE,
        alignItems: "center",
        justifyContent: "center",
    },
    numberLayer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
    numberText: {
        fontSize: 14,
        fontWeight: "bold",
    },
});
