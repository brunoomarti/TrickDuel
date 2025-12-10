import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { resetGame } from "@/store/slices/gameSlice";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { PartidaController } from "@/lib/controllers/PartidaController";

export default function QuickDuelFinalScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const results = useSelector((state: RootState) => state.game.results);

    const [saving, setSaving] = useState(false);

    const totalCorrect = results.filter((r) => r.correct).length;
    const totalErrors = results.length - totalCorrect;
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);

    useEffect(() => {
        const save = async () => {
            setSaving(true);

            const userRes = await supabase.auth.getUser();
            const user = userRes.data.user;
            if (!user) return;

            await PartidaController.savePartida({
                jogador_id: user.id,
                modo: "quick-duel",
                acertos: totalCorrect,
                erros: totalErrors,
                tempo_total: Math.round(totalTime),
                resultado: totalCorrect >= 3 ? "vitória" : "derrota",
            });

            setSaving(false);
        };

        save();
    }, []);

    return (
        <ScrollView className="flex-1 bg-[#F6E49C] p-6">
            <View className="items-center">
                <Text className="text-3xl font-bold mb-4">
                    Duelo concluído!
                </Text>

                <Text className="text-xl mb-2">
                    Acertos: {totalCorrect} / {results.length}
                </Text>

                <Text className="text-lg mb-6 opacity-80">
                    Tempo total: {totalTime.toFixed(1)}s
                </Text>

                <View className="w-full bg-white p-4 rounded-2xl">
                    {results.map((r, index) => (
                        <View key={index} className="mb-3">
                            <Text className="font-bold">Questão {index + 1}</Text>
                            <Text>Acertou: {r.correct ? "Sim" : "Não"}</Text>
                            <Text>Tempo: {r.timeSpent.toFixed(1)}s</Text>
                        </View>
                    ))}
                </View>

                <Button
                    className="mt-8 bg-blue-700 rounded-xl p-4"
                    disabled={saving}
                    onPress={() => {
                        dispatch(resetGame());
                        router.replace("/");
                    }}
                >
                    <ButtonText className="text-white font-bold">
                        {saving ? "Salvando..." : "Ir para o menu"}
                    </ButtonText>
                </Button>
            </View>
        </ScrollView>
    );
}
