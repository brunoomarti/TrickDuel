import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import MaskedView from "@react-native-masked-view/masked-view";
import { COLORS } from "@/theme/colors";

export type StepType = "completed" | "current" | "next";

interface StepProps {
    type: StepType;
    children: React.ReactNode;
    /** 0 → 1, usado só para o step "current" */
    progress?: number;
}

const SIZE = 32;
const RADIUS = SIZE / 2;
const CX = SIZE / 2;
const CY = SIZE / 2;

/**
 * Gera um path de "fatia" de pizza (wedge) de 0 a angleDeg graus,
 * começando do topo e indo no sentido horário.
 */
function createWedgePath(progress: number): string | null {
    if (progress <= 0) return null;
    if (progress >= 1) {
        // path de círculo cheio
        return `
            M ${CX} ${CY}
            m 0 -${RADIUS}
            a ${RADIUS} ${RADIUS} 0 1 1 0 ${SIZE}
            a ${RADIUS} ${RADIUS} 0 1 1 0 -${SIZE}
            Z
        `;
    }

    const startAngle = -90; // começa no topo
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

export function Step({ type, children, progress }: StepProps) {
    // Progresso só importa para o step atual
    const normalizedProgress =
        type === "current"
            ? Math.max(0, Math.min(1, progress ?? 0))
            : 0;

    const wedgePath = createWedgePath(normalizedProgress);
    const hasWedge = !!wedgePath;

    // Circle base
    let circleFill = "transparent";
    let circleStroke = "#9CA3AF"; // cinza
    let circleStrokeWidth = 2;

    if (type === "completed") {
        circleFill = "#9CA3AF"; // cinza cheio
        circleStrokeWidth = 0;
    } else if (type === "current") {
        circleFill = "#E5E7EB"; // cinza clarinho de fundo
        circleStrokeWidth = 0;
    } else if (type === "next") {
        circleFill = "transparent";
        circleStroke = "#9CA3AF";
        circleStrokeWidth = 2;
    }

    return (
        <View style={styles.container}>
            {/* Base: círculo + wedge roxo */}
            <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                {/* círculo base */}
                <Circle
                    cx={CX}
                    cy={CY}
                    r={RADIUS - circleStrokeWidth / 2}
                    fill={circleFill}
                    stroke={circleStroke}
                    strokeWidth={circleStrokeWidth}
                />

                {/* wedge roxo apenas para o "current" */}
                {type === "current" && hasWedge && (
                    <Path d={wedgePath!} fill={COLORS.secondaryColor} />
                )}
            </Svg>

            {/* Número base (preto) */}
            <View style={styles.numberLayer}>
                <Text style={styles.numberTextBase}>{children}</Text>
            </View>

            {/* Número branco apenas onde o wedge cobre (máscara) */}
            {type === "current" && hasWedge && (
                <MaskedView
                    style={styles.maskedLayer}
                    maskElement={
                        <Svg
                            width={SIZE}
                            height={SIZE}
                            viewBox={`0 0 ${SIZE} ${SIZE}`}
                        >
                            <Path d={wedgePath!} fill="white" />
                        </Svg>
                    }
                >
                    <View style={styles.numberLayer}>
                        <Text style={styles.numberTextOverlay}>{children}</Text>
                    </View>
                </MaskedView>
            )}
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
    maskedLayer: {
        ...StyleSheet.absoluteFillObject,
    },
    numberTextBase: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#111827", // preto
    },
    numberTextOverlay: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#ffffff", // branco
    },
});
