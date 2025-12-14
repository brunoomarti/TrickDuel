export type UpdateAIProfilePayload = {
    userId: string;
    questionId: string;
    difficulty: string;
    correct: boolean;
    answerTime: number;
};

export async function updateAIProfile(payload: UpdateAIProfilePayload) {
    try {
        const res = await fetch(
            "https://shuwatzvavpafrsszmgd.supabase.co/functions/v1/ai-update-profile",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....SEU TOKEN ANON",
                },
                body: JSON.stringify(payload),
            }
        );

        return await res.json();
    } catch (err) {
        console.error("Erro ao atualizar perfil da IA:", err);
    }
}
