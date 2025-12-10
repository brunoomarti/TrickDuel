import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { supabase } from "../lib/supabase";

import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { PartidasList } from "@/components/ui/custom/partidas-list";
import { QuickDuelCard } from "@/components/ui/custom/quick-duel-card";

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

    return (
        <VStack className="flex-1 justify-between space-y-6">

            <VStack className="flex-1 align-top space-y-6">

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

                <QuickDuelCard />

                {user && <PartidasList userId={user.id} />}
            </VStack>

            {profile && (
                <>
                    <Text className={infoClasses}>Jogador: {profile.username}</Text>
                    <Text className={infoClasses}>XP: {profile.xp}</Text>
                </>
            )}

        </VStack>
    );
}
