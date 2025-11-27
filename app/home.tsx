import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useColorScheme, View } from "react-native";
import { supabase } from "../lib/supabase";

import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Pressable } from "@/components/ui/pressable";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import Svg, { Path } from "react-native-svg";

import {
    LightningSingleStraightSplit,
    LIGHTNING_FILL_RIGHT_PATH,
} from "@/components/ui/custom/LightningSplit";

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

    const infoClasses = isDark
        ? "text-center text-purple-100"
        : "text-center text-slate-800";

    function goToQuickDuel() {
        return;
    }

    return (
        <VStack className="flex-1 justify-between space-y-6">

            <VStack className="flex-1 align-top space-y-6">

                {/* HEADER */}
                <HStack
                    className="w-full flex-row items-center p-6 justify-between mt-6"
                    style={{ height: 120 }}
                >
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

                {/* CARD */}
                <Pressable onPress={goToQuickDuel}>

                    {/* WRAPPER VERMELHO */}
                    <View
                        className="relative w-full items-center overflow-hidden"
                        style={{ height: 150 }}
                    >

                        {/* CAVALEIRO */}
                        <View className="absolute -left-6 -top-6 z-20">
                            <Image
                                source={require("@/assets/images/cavaleiro.png")}
                                resizeMode="contain"
                                className="w-[180px] h-[220px]"
                            />
                        </View>

                        {/* BOBO */}
                        <View className="absolute -right-6 top-2 z-20">
                            <Image
                                source={require("@/assets/images/bobo_da_corte.png")}
                                resizeMode="contain"
                                className="w-[180px] h-[150px]"
                            />
                        </View>

                        <Center
                            className="absolute bottom-0 w-[92%] h-36 rounded-2xl z-10"
                            // style={{
                            //     // sombra iOS
                            //     shadowColor: "#000",
                            //     shadowOffset: { width: 0, height: 6 },
                            //     shadowOpacity: 0.25,
                            //     shadowRadius: 10,
                            //     // sombra Android
                            //     elevation: 10,
                            // }}
                        >
                            <View className="w-full h-full rounded-2xl overflow-hidden relative">
                                {/* FUNDO AMARELO EM TUDO */}
                                <View
                                    className="absolute inset-0"
                                    style={{ backgroundColor: "#EFBA3C" }}
                                />

                                {/* FUNDO ROXO ACOPLADO AO RAIO */}
                                <Svg
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    style={{ position: "absolute" }}
                                >
                                    <Path
                                        d={LIGHTNING_FILL_RIGHT_PATH}
                                        fill="#7C4BD8"
                                        opacity={0.9}
                                    />
                                </Svg>

                                {/* RADIAL ÚNICO */}
                                <RadialRaysBackground opacity={0.06} rays={32} />

                                {/* RAIO BRANCO */}
                                <LightningSingleStraightSplit
                                    strokeColor="#ffffff"
                                    glowColor="#ffff0066"
                                />
                            </View>
                        </Center>
                    </View>
                </Pressable>
            </VStack>

            {/* INFOS DO PLAYER */}
            {profile && (
                <>
                    <Text className={infoClasses}>
                        Jogador: {profile.username}
                    </Text>
                    <Text className={infoClasses}>
                        XP: {profile.xp}
                    </Text>
                </>
            )}
        </VStack>
    );
}
