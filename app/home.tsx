import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "expo-router";
import {
    useColorScheme,
    ScrollView,
    Animated,
    SafeAreaView,
} from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { supabase } from "../lib/supabase";

import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

import { PartidasList } from "@/components/ui/custom/partidas-list";
import { QuickDuelCard } from "@/components/ui/custom/quick-duel-card";

import { COLORS } from "@/theme/colors";

import type { User } from "@supabase/supabase-js";

import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { MaterialIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";

type Profile = {
    id: string;
    username: string;
    avatar_url: string;
    xp: number;
};

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedHStack = Animated.createAnimatedComponent(HStack);
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function HomeScreen() {
    const router = useRouter();
    const scheme = useColorScheme();
    const theme = COLORS[scheme ?? "light"];

    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    const scrollY = useRef(new Animated.Value(0)).current;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/(auth)/login");
    };

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                BackHandler.exitApp();
                return true;
            };

            const sub = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );

            return () => sub.remove();
        }, [])
    );

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data }) => {
            if (!data?.user) {
                router.replace("/(auth)/login");
                return;
            }

            setUser(data.user);

            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", data.user.id)
                .single();

            setProfile(profileData);
        });
    }, []);

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [140, 90],
        extrapolate: "clamp",
    });

    const headerPaddingTop = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [42, 28],
        extrapolate: "clamp",
    });

    const logoScale = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [1, 0.6],
        extrapolate: "clamp",
    });

    const shadowOpacity = scrollY.interpolate({
        inputRange: [0, 10],
        outputRange: [0, 0.25],
        extrapolate: "clamp",
    });

    const shadowRadius = scrollY.interpolate({
        inputRange: [0, 10],
        outputRange: [0, 6],
        extrapolate: "clamp",
    });

    const shadowElevation = scrollY.interpolate({
        inputRange: [0, 10],
        outputRange: [0, 8],
        extrapolate: "clamp",
    });

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        // espaço pra lógica extra se você quiser no futuro
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.background,
            }}
        >
            <VStack className="flex-1">
                <AnimatedHStack
                    className="w-full relative flex-row items-center"
                    style={[
                        {
                            height: headerHeight,
                            paddingHorizontal: 24,
                            paddingTop: headerPaddingTop,
                            paddingBottom: 10,
                            backgroundColor: theme.backgroundHeader,
                            zIndex: 10,
                        },
                        {
                            elevation: shadowElevation,
                            shadowColor: theme.shadowColor,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: shadowOpacity,
                            shadowRadius: shadowRadius,
                        },
                    ]}
                >
                    <Box className="w-10" />

                    <Center className="flex-1 items-center justify-center">
                        <AnimatedImage
                            source={require("@/assets/images/titulo_logo.png")}
                            className="h-full w-2/3"
                            alt="AltLogo"
                            resizeMode="contain"
                            style={{
                                transform: [{ scale: logoScale }],
                            }}
                        />
                    </Center>

                    <Box className="w-10 items-end justify-center">
                        <Button
                            onPress={handleLogout}
                            className="h-8 w-10 rounded-xl p-0 items-center justify-center"
                            style={{
                                backgroundColor:
                                    scheme === "dark"
                                        ? "rgba(239, 68, 68, 0.75)"
                                        : "rgba(220, 38, 38, 0.85)",
                            }}
                        >
                            <MaterialIcons name="logout" size={18} color="#fff" />
                        </Button>
                    </Box>
                </AnimatedHStack>

                <AnimatedScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        paddingBottom: 24,
                    }}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        {
                            useNativeDriver: false,
                            listener: handleScroll,
                        }
                    )}
                    scrollEventThrottle={16}
                >
                    <VStack className="flex-1 align-top">
                        <QuickDuelCard />
                        {user && <PartidasList userId={user.id} />}
                    </VStack>
                </AnimatedScrollView>

                {profile && (
                    <VStack className="pb-6 pt-4 space-y-1">
                        <Text
                            className="text-center"
                            style={{ color: theme.accent }}
                        >
                            Jogador: {profile.username}
                        </Text>
                        <Text
                            className="text-center"
                            style={{ color: theme.textSecondary }}
                        >
                            XP: {profile.xp}
                        </Text>
                    </VStack>
                )}
            </VStack>
        </SafeAreaView>
    );
}
