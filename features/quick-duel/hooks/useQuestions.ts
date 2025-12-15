import { useApolloClient } from "@apollo/client";
import { useEffect, useState } from "react";

import { normalizeQuestions } from "../model/question.normalizer";
import { Question, PerguntaAPI } from "../model/question.types";

import {
    GET_PERGUNTAS_POOL,
    GET_PERGUNTAS_BY_IDS,
} from "@/graphql/queries/getPerguntas";

import { supabase } from "@/lib/supabase";

const QUESTIONS_PER_MATCH = 6;
const DEFAULT_TIME_PER_QUESTION = 15;
const COOLDOWN_MINUTES = 60;

type PickQuestionsRow = { question_id: string };

export function useQuestions() {
    const client = useApolloClient();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadQuestions() {
            try {
                setLoading(true);

                const poolRes = await client.query<{
                    perguntas: { id: string }[];
                }>({
                    query: GET_PERGUNTAS_POOL,
                    fetchPolicy: "network-only",
                });

                const poolIds = poolRes.data.perguntas.map((p) => p.id);
                console.log("🟦 [useQuestions] POOL IDS:", poolIds.length, poolIds);

                if (!poolIds.length) {
                    setQuestions([]);
                    return;
                }

                const { data: picked, error: pickError } = await supabase.rpc("pick_questions", {
                    candidate_ids: poolIds,
                    limit_count: QUESTIONS_PER_MATCH,
                    cooldown_minutes: COOLDOWN_MINUTES,
                });

                if (pickError) throw pickError;

                let pickedIds: string[] = (picked as PickQuestionsRow[] | null)?.map((r) => r.question_id) ?? [];
                console.log("🟨 [useQuestions] PICKED (cooldown):", pickedIds.length, pickedIds);

                if (pickedIds.length < QUESTIONS_PER_MATCH) {
                    const { data: fallback } = await supabase.rpc(
                        "pick_questions",
                        {
                            candidate_ids: poolIds,
                            limit_count: QUESTIONS_PER_MATCH,
                            cooldown_minutes: 0,
                        }
                    );

                    pickedIds = fallback?.map((p: any) => p.question_id) ?? [];
                    console.log("🟧 [useQuestions] PICKED (fallback):", pickedIds.length, pickedIds);

                }

                if (!pickedIds.length) {
                    setQuestions([]);
                    return;
                }

                const detailsRes = await client.query<{
                    perguntas: PerguntaAPI[];
                }>({
                    query: GET_PERGUNTAS_BY_IDS,
                    variables: { ids: pickedIds },
                    fetchPolicy: "network-only",
                });

                const byId = new Map<string, PerguntaAPI>(
                    detailsRes.data.perguntas.map((q) => [q.id, q])
                );

                const ordered: PerguntaAPI[] = pickedIds
                    .map((id: string) => byId.get(id))
                    .filter((q): q is PerguntaAPI => Boolean(q));

                const normalized = normalizeQuestions(
                    ordered,
                    DEFAULT_TIME_PER_QUESTION
                );

                if (!cancelled) setQuestions(normalized);
            } catch (err) {
                console.error("Erro ao carregar perguntas:", err);
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadQuestions();

        return () => {
            cancelled = true;
        };
    }, [client]);

    return { questions, loading, error };
}
