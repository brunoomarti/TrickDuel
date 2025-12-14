import { useState, useRef } from "react";
import { View, Animated, Easing, useColorScheme } from "react-native";
import { Pressable } from "@/components/ui/pressable";
import { Center } from "@/components/ui/center";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import Svg, { Path } from "react-native-svg";

import QuickDuelScreen from "@/app/(modes)/(quick-duel)/quick-duel";
import { startScreenTransition } from "@/app/_layout";

import {
    LightningSingleStraightSplit,
    LIGHTNING_FILL_RIGHT_PATH,
} from "@/components/ui/custom/LightningSplit";

import { RadialRaysBackground } from "@/components/ui/custom/radial-background";
import { COLORS } from "@/theme/colors";

export function QuickDuelCard() {
    const scheme = useColorScheme();
    const theme = COLORS[scheme ?? "light"];

    const knightY = useRef(new Animated.Value(220)).current;
    const jesterY = useRef(new Animated.Value(220)).current;
    const titleY = useRef(new Animated.Value(220)).current;

    const [open, setOpen] = useState(false);
    const heightAnim = useRef(new Animated.Value(0)).current;
    const marginAnim = useRef(new Animated.Value(0)).current;

    const [measured, setMeasured] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);

    function startIntroAnimations() {
        Animated.spring(knightY, {
            toValue: 0,
            friction: 6,
            tension: 20,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            Animated.spring(titleY, {
                toValue: 0,
                friction: 6,
                tension: 20,
                useNativeDriver: true,
            }).start();
        }, 100);

        setTimeout(() => {
            Animated.spring(jesterY, {
                toValue: 0,
                friction: 6,
                tension: 20,
                useNativeDriver: true,
            }).start();
        }, 200);
    }

    useState(() => {
        startIntroAnimations();
    });

    function toggle() {
        if (!measured) return;

        const newHeight = open ? 0 : contentHeight;
        const newMargin = open ? 0 : 8;

        setOpen(!open);

        Animated.parallel([
            Animated.timing(heightAnim, {
                toValue: newHeight,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }),
            Animated.timing(marginAnim, {
                toValue: newMargin,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            })
        ]).start();
    }

    function goToQuickDuel() {
        startScreenTransition(
            (
                <View
                    className="flex-1 items-center justify-center"
                    style={{ backgroundColor: COLORS.primaryColor }}
                >
                </View>
            ),
            "/quick-duel");
    }

    return (
        <>
            {/* CARD PRINCIPAL */}
            <Pressable onPress={toggle}>
                <View
                    className="relative w-full items-center overflow-hidden"
                    style={{ height: 150 }}
                >

                    {/* Título */}
                    <Animated.View
                        style={{ transform: [{ translateY: titleY }] }}
                        className="absolute -top-6 z-20"
                    >
                        <Image
                            source={require("@/assets/images/duelo_rapido.png")}
                            resizeMode="contain"
                            className="w-[120px] h-[220px]"
                        />
                    </Animated.View>

                    {/* Cavaleiro */}
                    <Animated.View
                        style={{ transform: [{ translateY: knightY }] }}
                        className="absolute -left-6 -top-6 z-20"
                    >
                        <Image
                            source={require("@/assets/images/cavaleiro.png")}
                            resizeMode="contain"
                            className="w-[180px] h-[220px]"
                        />
                    </Animated.View>

                    {/* Bobo */}
                    <Animated.View
                        style={{ transform: [{ translateY: jesterY }] }}
                        className="absolute -right-6 top-2 z-20"
                    >
                        <Image
                            source={require("@/assets/images/bobo_da_corte.png")}
                            resizeMode="contain"
                            className="w-[180px] h-[150px]"
                        />
                    </Animated.View>

                    {/* Background do card */}
                    <Center className="absolute bottom-0 w-[90%] h-36 rounded-2xl z-10">
                        <View className="w-full h-full rounded-2xl overflow-hidden relative">

                            {/* Fundo principal */}
                            <View
                                className="absolute inset-0"
                                style={{ backgroundColor: COLORS.primaryColor }}
                            />

                            {/* Lightning preenchendo lateral */}
                            <Svg
                                width="100%"
                                height="100%"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                style={{ position: "absolute" }}
                            >
                                <Path
                                    d={LIGHTNING_FILL_RIGHT_PATH}
                                    fill={COLORS.secondaryColor}
                                />
                            </Svg>

                            <RadialRaysBackground opacity={0.06} rays={32} />

                            <LightningSingleStraightSplit
                                strokeColor={theme.background}
                                glowColor={theme.glow}
                            />
                        </View>
                    </Center>
                </View>
            </Pressable>

            {/* SANFONA */}
            <Animated.View
                className="rounded-2xl"
                style={{
                    overflow: "hidden",
                    marginTop: marginAnim,
                    marginHorizontal: 21,
                    backgroundColor: theme.cardBackground,
                    height: measured ? heightAnim : undefined,
                    opacity: measured ? 1 : 0,
                }}
            >
                <View
                    style={{ padding: 16 }}
                    onLayout={(e) => {
                        if (!measured) {
                            const h = e.nativeEvent.layout.height;
                            setContentHeight(h);
                            heightAnim.setValue(0);
                            setMeasured(true);
                        }
                    }}
                >
                    <Text
                        className="text-xl font-bold mb-3 text-center"
                        style={{ color: theme.textPrimary }}
                    >
                        Iniciar duelo rápido?
                    </Text>

                    <View className="flex-row justify-between mt-2">

                        {/* Botão OK */}
                        <Pressable
                            onPress={goToQuickDuel}
                            className="flex-1 rounded-lg p-3 mr-2"
                            style={{ backgroundColor: theme.accent }}
                        >
                            <Text
                                className="text-center font-bold"
                                style={{ color: 'white' }}
                            >
                                Vamos lá!
                            </Text>
                        </Pressable>

                        {/* Botão CANCELAR */}
                        <Pressable
                            onPress={toggle}
                            className="flex-1 rounded-lg p-3 ml-2"
                            style={{ backgroundColor: theme.textSecondary }}
                        >
                            <Text
                                className="text-center font-bold"
                                style={{ color: theme.background }}
                            >
                                Agora não
                            </Text>
                        </Pressable>

                    </View>
                </View>
            </Animated.View>
        </>
    );
}
