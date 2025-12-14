import React, { useRef, useEffect } from "react";
import { View, Pressable, Animated, Easing, useColorScheme } from "react-native";
import { Text } from "@/components/ui/text";
import { COLORS } from "@/theme/colors";

export type Answer = {
    id: string;
    text: string;
};

type AnimatedAnswerItemProps = {
    answer: Answer;
    isSelected: boolean;
    isOpponentSelected: boolean;
    onPress: () => void;
};

const AnimatedAnswerItem: React.FC<AnimatedAnswerItemProps> = ({
    answer,
    isSelected,
    isOpponentSelected,
    onPress,
}) => {
    const scheme = useColorScheme();
    const theme = COLORS[scheme ?? "light"];

    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isSelected) {
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 0.97,
                    duration: 80,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.ease),
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 80,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.ease),
                }),
            ]).start();
        }
    }, [isSelected]);

    const selectedBg =
        scheme === "dark"
            ? theme.accentSoft
            : theme.accent;

    const selectedText = "#FFFFFF";

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
                onPress={onPress}
                style={{
                    width: "100%",
                    paddingVertical: 18,
                    paddingHorizontal: 20,
                    borderRadius: 16,
                    height: 62,
                    backgroundColor: isSelected
                        ? selectedBg
                        : theme.cardBackground,

                    position: "relative",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text
                    style={{
                        textAlign: "center",
                        color: isSelected ? selectedText : theme.textPrimary,
                        fontSize: 16,
                        lineHeight: 22,
                    }}
                >
                    {answer.text}
                </Text>

                {isOpponentSelected && (
                    <View
                        style={{
                            position: "absolute",
                            right: 14,
                            width: 28,
                            height: 28,
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: scheme === "dark" ? "rgba(255,255,255,0.18)" : theme.accent,
                            backgroundColor: scheme === "dark" ? theme.accent : theme.accentSoft,
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: scheme === "dark" ? theme.accent : undefined,
                            shadowOpacity: scheme === "dark" ? 0.35 : 0,
                            shadowRadius: scheme === "dark" ? 6 : 0,
                            shadowOffset: { width: 0, height: 2 },
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: "800",
                                color: scheme === "dark" ? "#FFFFFF" : theme.accent,
                                letterSpacing: 0.5,
                            }}
                        >
                            OP
                        </Text>
                    </View>
                )}

            </Pressable>
        </Animated.View>
    );
};


type AnswersListProps = {
    answers: Answer[];
    selectedId: string | null;
    opponentId?: string | null;
    onSelect: (id: string) => void;
};

export const AnswersList: React.FC<AnswersListProps> = ({
    answers,
    selectedId,
    opponentId,
    onSelect,
}) => {
    return (
        <View className="w-full gap-3">
            {answers.map((answer) => (
                <AnimatedAnswerItem
                    key={answer.id}
                    answer={answer}
                    isSelected={selectedId === answer.id}
                    isOpponentSelected={opponentId === answer.id}
                    onPress={() => onSelect(answer.id)}
                />
            ))}
        </View>
    );
};

