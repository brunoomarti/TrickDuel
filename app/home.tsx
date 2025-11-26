import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useColorScheme, View } from "react-native";
import { supabase } from "../lib/supabase";

import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"
import { Box } from "@/components/ui/box"
import { Center } from "@/components/ui/center"
import { Pressable } from "@/components/ui/pressable"
import { Image } from "@/components/ui/image"
import { Text } from "@/components/ui/text"
import { LightningSingleStraightSplit } from "@/components/ui/custom/LightningSplit";

import { PrimaryButton } from "@/components/ui/custom/buttons/primary-button";
import { RadialRaysBackground } from "@/components/ui/custom/radial-background";

import type { User } from "@supabase/supabase-js";

type Profile = {
    id: string;
    username: string;
    avatar_url: string;
    xp: number;
};

export default function HomeScreen() {
    const router = useRouter();
    const scheme = useColorScheme();
    const isDark = scheme === "dark";
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

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

    async function logout() {
        if (loading) return;

        try {
            setLoading(true);
            await supabase.auth.signOut();
            router.replace("/(auth)/login");
        } catch (e) {
            console.error(e);
            alert("Não foi possível sair.");
        } finally {
            setLoading(false);
        }
    }

    const infoClasses = isDark
        ? "text-center text-purple-100"
        : "text-center text-slate-800";

    const HEADER_HEIGHT = 140;

    function goToProfile() {
        // router.push("/profile");
        return;
    }

    function goToQuickDuel() {
        // router.push("/profile");
        return;
    }

    return (
        <VStack className="flex-1 justify-between p-6 space-y-6">

            <VStack className="flex-1 align-top space-y-6">
                <HStack
                    className="w-full flex-row items-center justify-between"
                    style={{ height: 120 }}
                >

                    {/* <Pressable onPress={goToProfile}>
                        <Center className="w-14 h-14 mt-2 rounded-full overflow-hidden bg-gray-300 items-center justify-center">
                            {profile?.avatar_url ? (
                                <Image
                                    source={{ uri: profile.avatar_url }}
                                    alt="Avatar"
                                    resizeMode="cover"
                                    className="w-full h-full"
                                />
                            ) : (
                                <Text className="font-bold text-md">
                                    {profile?.username?.charAt(0).toUpperCase() ?? "?"}
                                </Text>
                            )}
                        </Center>
                    </Pressable> */}

                    <Box className="w-14 h-14 mt-2" />

                    <Center className="flex-1 h-full items-center justify-center">
                        <Image
                            source={require("@/assets/images/titulo_logo.png")}
                            alt="AltLogo"
                            resizeMode="contain"
                            className="h-full w-4/6"
                        />
                    </Center>

                    <Box className="w-14 h-14 mt-2" />

                </HStack>

                <Pressable onPress={goToQuickDuel}>
                    <Center
                        className="w-full h-36 mt-2 rounded-2xl overflow-hidden items-center justify-center"
                        style={{ backgroundColor: "#EFBA3C", position: "relative" }}
                    >
                        {/* Fundo radial continua normal */}
                        <RadialRaysBackground color="#dba62b" opacity={0.5} rays={32} />

                        {/* Apenas o raio por cima */}
                        <LightningSingleStraightSplit strokeColor="#ffffff" glowColor="#ffff0066" />

                        <Image
                            source={require("@/assets/images/bobo_da_corte.png")}
                            alt="Avatar"
                            resizeMode="cover"
                            className="h-full w-6/12 left-32"
                        />

                        {/* <Text className="font-extrabold text-2xl text-purple-900" style={{ position: "absolute" }}>
                            Quick Duel
                        </Text> */}
                    </Center>
                </Pressable>
            </VStack>

            {profile && (
                <>
                    <Text className={infoClasses}>Jogador: {profile.username}</Text>
                    <Text className={infoClasses}>XP: {profile.xp}</Text>
                </>
            )}

            {/* <PrimaryButton
                onPress={logout}
                loading={loading}
                label="Sair"
            /> */}
        </VStack>
    );
}
