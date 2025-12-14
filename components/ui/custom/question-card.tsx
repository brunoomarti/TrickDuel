import React from "react";
import { View, ImageSourcePropType, useColorScheme } from "react-native";
import { Center } from "@/components/ui/center";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { COLORS } from "@/theme/colors";

type QuestionCardProps = {
    text: React.ReactNode;
    imageSource?: ImageSourcePropType;
    timeLeftSeconds?: number;
    timeTotalSeconds?: number;
};

export function QuestionCard({
    text,
    imageSource,
    timeLeftSeconds,
    timeTotalSeconds,
}: QuestionCardProps) {
    const scheme = useColorScheme();
    const theme = COLORS[scheme ?? "light"];

    const showTimer =
        typeof timeLeftSeconds === "number" &&
        typeof timeTotalSeconds === "number";

    return (
        <Center
            className="w-full p-6 rounded-2xl flex-1"
            style={{ backgroundColor: theme.cardBackground }}
        >
            <View
                className="w-full h-full justify-center items-center gap-4"
            >
                {imageSource && (
                    <Image
                        source={imageSource}
                        alt="Imagem da pergunta"
                        className="w-40 h-40 rounded-2xl"
                        resizeMode="contain"
                    />
                )}

                <View className="w-full items-center">
                    <Text
                        className="text-2xl text-center leading-snug"
                        style={{ color: theme.textPrimary }}
                    >
                        {text}
                    </Text>
                </View>

                {showTimer && (
                    <Text
                        className="text-xs mt-2"
                        style={{ color: theme.textSecondary }}
                    >
                        {timeLeftSeconds!.toString().padStart(2, "0")}s /{" "}
                        {timeTotalSeconds!.toString().padStart(2, "0")}s
                    </Text>
                )}
            </View>
        </Center>
    );
}
