import { htmlToPlainText } from "../utils/html";
import { shuffleArray } from "../utils/shuffle";
import { Question, PerguntaAPI } from "./question.types";

export function normalizeQuestions(
    perguntas: PerguntaAPI[],
    fallbackTime: number
): Question[] {
    return perguntas.map((p) => {
        const rawHtml = p.enunciado?.html ?? null;

        return {
            id: p.id,
            text: htmlToPlainText(rawHtml),
            textHtml: rawHtml,
            imageSource: p.imagem?.url ? { uri: p.imagem.url } : undefined,

            timeLimit: p.tempoLimite ?? fallbackTime,

            tipo: p.tipo ?? "NORMAL",
            dica: p.dica ?? null,
            dificuldade: p.dificuldade ?? "facil",

            answers: shuffleArray(
                (p.alternativa ?? []).map((a) => ({
                    id: a.id,
                    text: htmlToPlainText(a.texto),
                    isCorrect: a.correta,
                }))
            ),
        };
    });
}
