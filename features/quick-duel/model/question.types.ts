import type { ImageSourcePropType } from "react-native";

export type PerguntaAPI = {
    id: string;
    enunciado?: { html?: string | null } | null;
    tempoLimite?: number | null;
    tipo?: string | null;
    dica?: string | null;
    dificuldade?: string | null;
    imagem?: { url?: string | null } | null;
    alternativa?: {
        id: string;
        texto: string;
        correta: boolean;
    }[] | null;
};

export type Question = {
    id: string;
    text: string;
    textHtml: string | null;
    imageSource?: ImageSourcePropType;
    timeLimit: number;

    tipo: string;
    dica: string | null;
    dificuldade: string;

    answers: {
        id: string;
        text: string;
        isCorrect: boolean;
    }[];
};

