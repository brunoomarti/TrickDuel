import React, { useEffect } from "react";
import { Animated, Easing } from "react-native";
import { Pressable } from "@/components/ui/pressable";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";

export type Answer = {
    id: string;
    text: string;
};

type AnswersListProps = {
    answers: Answer[];
    selectedId?: string | null;
    onSelect?: (id: string) => void;
};

type AnimatedAnswerItemProps = {
    index: number;
    selected: boolean;
    text: string;
    onPress: () => void;
};

function AnimatedAnswerItem({
    index,
    selected,
    text,
    onPress,
}: AnimatedAnswerItemProps) {
    const scale = React.useRef(new Animated.Value(0.8)).current;
    const pressScale = React.useRef(new Animated.Value(1)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;
    const bgAnim = React.useRef(new Animated.Value(selected ? 1 : 0)).current;

    // anima entrada inicial
    useEffect(() => {
        const delay = index * 90;

        scale.setValue(0.8);
        opacity.setValue(0);

        Animated.parallel([
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.05,
                    duration: 140,
                    easing: Easing.out(Easing.back(1.3)),
                    useNativeDriver: true,
                    delay,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 110,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
                delay,
            }),
        ]).start();
    }, []);

    // anima seleção (bg/text)
    useEffect(() => {
        Animated.timing(bgAnim, {
            toValue: selected ? 1 : 0,
            duration: 180,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [selected]);

    const backgroundColor = bgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#FFFFFF", "#7C3AED"],
    });

    const textColor = bgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#333333", "#FFFFFF"],
    });

    // 🔥 animação TAP-DOWN
    const handlePressIn = () => {
        Animated.timing(pressScale, {
            toValue: 0.95,
            duration: 80,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(pressScale, {
            toValue: 1,
            duration: 120,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={{
                width: "100%",
                opacity,
                transform: [
                    { scale },        // animação de entrada
                    { scale: pressScale }, // animação de toque
                ],
            }}
        >
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
            >
                <Animated.View
                    style={{
                        width: "100%",
                        backgroundColor,
                        paddingVertical: 22,
                        paddingHorizontal: 20,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Animated.Text
                        style={{
                            color: textColor,
                            fontSize: 16,
                            fontWeight: "500",
                            textAlign: "center",
                        }}
                    >
                        {text}
                    </Animated.Text>
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
}


export function AnswersList({ answers, selectedId, onSelect }: AnswersListProps) {
    return (
        <Center className="w-full gap-3">
            {answers.map((answer, index) => {
                const selected = answer.id === selectedId;

                return (
                    <AnimatedAnswerItem
                        key={answer.id}
                        index={index}
                        selected={selected}
                        text={answer.text}
                        onPress={() => onSelect?.(answer.id)}
                    />
                );
            })}
        </Center>
    );
}
