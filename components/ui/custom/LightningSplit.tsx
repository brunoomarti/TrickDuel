import Svg, { Path } from "react-native-svg";

// caminho do TRAÇO do raio (o que você já usa hoje)
export const LIGHTNING_STROKE_PATH = `
    M63 -10
    L50 42
    L48 50
    L50 50
    L35 110
`;

// caminho de PREENCHIMENTO pegando o lado direito do raio
// (fecha o shape indo até a borda direita do card)
export const LIGHTNING_FILL_RIGHT_PATH = `
    M63 -10
    L50 40
    L48 48
    L50 50
    L35 110
    L100 110
    L100 -10
    Z
`;

type LightningProps = {
    strokeColor?: string;
    glowColor?: string;   // se quiser usar depois
    strokeWidth?: number;
    angle?: number;
};

export function LightningSingleStraightSplit({
    strokeColor = "#FFFFFF",
    glowColor = "#FFFF0088", // ainda não usado, mas mantive
    strokeWidth = 2,
    angle = -8,
}: LightningProps) {
    return (
        <Svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
                position: "absolute",
            }}
        >
            <Path
                d={LIGHTNING_STROKE_PATH}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
            />
        </Svg>
    );
}
