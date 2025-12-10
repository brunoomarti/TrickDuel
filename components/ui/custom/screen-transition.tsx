import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";

const { width, height } = Dimensions.get("window");
const BIG = Math.sqrt(width * width + height * height) * 2;

type Props = {
    duration?: number;
    color1?: string;
    color2?: string;
    onFinish?: () => void;
};

export function ScreenTransition({
    duration = 1200,
    color1 = "#EFBA3C",
    color2 = "#7C4BD8",
    onFinish = () => { },
    children,
}: React.PropsWithChildren<Props>) {
    const c1 = useRef(new Animated.Value(0)).current;
    const c2 = useRef(new Animated.Value(0)).current;
    const mask = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(c1, {
                toValue: 1,
                duration: duration * 0.6,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(c2, {
                toValue: 1,
                delay: duration * 0.15,
                duration: duration * 0.55,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(mask, {
                toValue: 1,
                delay: duration * 0.35,
                duration: duration * 0.5,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start(onFinish);
    }, []);

    return (
        <View style={{ position: "absolute", inset: 0, zIndex: 9999 }}>

            <Animated.View
                style={{
                    position: "absolute",
                    top: height / 2 - BIG / 2,
                    left: width / 2 - BIG / 2,
                    width: BIG,
                    height: BIG,
                    borderRadius: BIG / 2,
                    backgroundColor: color1,
                    transform: [{ scale: c1 }],
                }}
            />

            <Animated.View
                style={{
                    position: "absolute",
                    top: height / 2 - BIG / 2,
                    left: width / 2 - BIG / 2,
                    width: BIG,
                    height: BIG,
                    borderRadius: BIG / 2,
                    backgroundColor: color2,
                    transform: [{ scale: c2 }],
                }}
            />

            <MaskedView
                style={{ flex: 1 }}
                maskElement={
                    <Animated.View
                        style={{
                            position: "absolute",
                            top: height / 2 - BIG / 2,
                            left: width / 2 - BIG / 2,
                            width: BIG,
                            height: BIG,
                            borderRadius: BIG / 2,
                            backgroundColor: "black",
                            transform: [{ scale: mask }],
                        }}
                    />
                }
            >
                {/* próxima tela */}
                <View style={{ flex: 1 }}>{children}</View>
            </MaskedView>
        </View>
    );
}
