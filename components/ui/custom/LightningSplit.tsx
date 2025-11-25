import Svg, { Path } from "react-native-svg";

export function LightningSingleStraightSplit({
    strokeColor = "#FFFFFF",
    glowColor = "#FFFF0088",
    strokeWidth = 6,
    angle = -8,
}) {
    return (
        <Svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
                position: "absolute",
                transform: [{ rotate: `${angle}deg` }],
            }}
        >
            {/* Glow */}
            <Path
                d="
                    M50 10
                    L50 40
                    L48 50
                    L50 60
                    L50 90
                "
                stroke={glowColor}
                strokeWidth={strokeWidth + 10}
                strokeLinecap="round"
                fill="none"
            />

            {/* Linha principal */}
            <Path
                d="
                    M50 10
                    L50 40
                    L48 50
                    L50 60
                    L50 90
                "
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
            />
        </Svg>
    );
}
