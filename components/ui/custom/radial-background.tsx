import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Easing } from "react-native";
import Svg, { Path, Defs, RadialGradient, Stop } from "react-native-svg";

const AnimatedView = Animated.createAnimatedComponent(Animated.View);

type Props = {
    color?: string;
    opacity?: number;
    rays?: number;
    animate?: boolean;
};

export function RadialRaysBackground({
    color = "#000000",
    opacity = 0.15,
    rays = 32,
    animate = true,
}: Props) {
    const rotateBase = useRef(new Animated.Value(0)).current;
    const rotateLoop = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!animate) return;

        scale.setValue(0.1);

        Animated.timing(scale, {
            toValue: 1,
            duration: 4000,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            useNativeDriver: true,
        }).start();

        Animated.timing(rotateBase, {
            toValue: 1,
            duration: 12000,
            easing: Easing.out(Easing.poly(10)),
            useNativeDriver: true,
        }).start();

        Animated.loop(
            Animated.timing(rotateLoop, {
                toValue: 2,
                duration: 100000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            { resetBeforeIteration: true }
        ).start();
    }, [animate, rotateBase, rotateLoop, scale]);

    const combined = Animated.add(rotateBase, rotateLoop);

    const spin = combined.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    const animatedStyle = animate
        ? { transform: [{ rotate: spin }, { scale }] }
        : undefined;

    const cx = 50;
    const cy = 50;
    const radius = 150;
    const stepAngle = (Math.PI * 2) / rays;

    const raysElements = [];
    for (let i = 0; i < rays; i++) {
        if (i % 2 !== 0) continue;

        const a1 = i * stepAngle;
        const a2 = (i + 1) * stepAngle;

        const x1 = cx + radius * Math.cos(a1);
        const y1 = cy + radius * Math.sin(a1);
        const x2 = cx + radius * Math.cos(a2);
        const y2 = cy + radius * Math.sin(a2);

        raysElements.push(
            <Path
                key={i}
                d={`M ${cx} ${cy} L ${x1} ${y1} L ${x2} ${y2} Z`}
                fill={color}
                opacity={opacity}
            />
        );
    }

    return (
        <AnimatedView
            pointerEvents="none"
            style={[styles.container, animatedStyle]}
        >
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
                <Defs>
                    <RadialGradient id="rayGradient" cx="50%" cy="50%" r="50%">
                        <Stop offset="0%" stopColor={color} stopOpacity={0} />
                        <Stop offset="80%" stopColor={color} stopOpacity={opacity * 0.4} />
                        <Stop offset="100%" stopColor={color} stopOpacity={opacity} />
                    </RadialGradient>
                </Defs>
                {raysElements.map((path, index) => (
                    <Path
                        key={index}
                        d={path.props.d}
                        fill="url(#rayGradient)"
                    />
                ))}
            </Svg>
        </AnimatedView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "360%",
        height: "360%",
        top: "-130%",
        left: "-130%",
    },
});
