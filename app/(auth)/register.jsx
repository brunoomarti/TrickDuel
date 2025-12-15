import { useState } from "react";
import { useRouter } from "expo-router";
import {
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    useColorScheme,
} from "react-native";
import { supabase } from "../../lib/supabase";

import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { GameBackground } from "@/components/ui/custom/game-bg";
import { GlassCard } from "@/components/ui/custom/glass-card";
import { GameLogo } from "@/components/ui/custom/game-logo";
import { GameInput } from "@/components/ui/custom/game-input";
import { PrimaryButton } from "@/components/ui/custom/buttons/primary-button";

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const scheme = useColorScheme();
    const isDark = scheme === "dark";

    async function handleRegister() {
        if (loading) return;

        if (!email || !senha || !username) {
            alert("Preencha todos os campos.");
            return;
        }

        if (senha.length < 6) {
            alert("A senha deve ter ao menos 6 caracteres.");
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase.auth.signUp({
                email,
                password: senha,
                options: {
                    data: {
                        username,
                    },
                },
            });

            if (error) {
                alert(error.message);
                return;
            }

            router.replace("/home");
        } catch (e) {
            console.error(e);
            alert("Não foi possível criar sua conta. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }


    const titleClasses = isDark
        ? "text-white text-3xl font-bold text-center"
        : "text-purple-900 text-3xl font-bold text-center";

    const linkClasses = isDark
        ? "text-center text-purple-200 text-base"
        : "text-center text-purple-700 text-base";

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <GameBackground>
                    <GameLogo />

                    <GlassCard className="mt-10 py-8 px-6">
                        <VStack space="xl">
                            <Text className={titleClasses}>Criar Conta</Text>

                            <VStack space="lg">
                                <GameInput
                                    label="Nome de usuário"
                                    placeholder="Seu nick"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />

                                <GameInput
                                    label="E-mail"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                />

                                <GameInput
                                    label="Senha"
                                    placeholder="••••••••"
                                    value={senha}
                                    onChangeText={setSenha}
                                    secureTextEntry
                                    autoCapitalize="none"
                                />
                            </VStack>

                            <PrimaryButton
                                onPress={handleRegister}
                                loading={loading}
                                label="Criar Conta"
                            />

                            <Text
                                className={linkClasses}
                                onPress={() =>
                                    !loading && router.push("/(auth)/login")
                                }
                            >
                                Voltar para login
                            </Text>
                        </VStack>
                    </GlassCard>
                </GameBackground>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
});
