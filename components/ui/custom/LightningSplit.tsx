import Svg, { Path } from "react-native-svg";

export function LightningSingleStraightSplit({
    strokeColor = "#FFFFFF",
    glowColor = "#FFFF0088",
    strokeWidth = 2,
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

            {/* Linha principal */}
            <Path
                d="
                    M63 -10
                    L50 40
                    L48 48
                    L50 50
                    L35 110
                "
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
            />
        </Svg>
    );
}
