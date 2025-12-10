import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { normalizeQuestions } from "../model/question.normalizer";
import { Question, PerguntaAPI } from "../model/question.types";
import { GET_PERGUNTAS } from "@/graphql/queries/getPerguntas";

const QUESTIONS_PER_MATCH = 6;
const DEFAULT_TIME_PER_QUESTION = 15;

type GetPerguntasData = {
    perguntas?: PerguntaAPI[] | null;
};

export function useQuestions() {
    const { data, loading, error } = useQuery<GetPerguntasData>(GET_PERGUNTAS);
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        if (!data?.perguntas?.length) return;

        const result = normalizeQuestions(
            data.perguntas,
            QUESTIONS_PER_MATCH,
            DEFAULT_TIME_PER_QUESTION
        );

        setQuestions(result);
    }, [data]);

    return { questions, loading, error };
}