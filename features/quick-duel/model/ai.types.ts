export type Difficulty = "easy" | "medium" | "hard";

export type Answer = {
    id: string;
    text: string;
    isCorrect: boolean;
};

export type Question = {
    id: string;
    textHtml: string;
    difficulty: Difficulty;
    answers: Answer[];
    imageSource?: any;
};

export type AIProfile = {
    level_easy: number;
    level_medium: number;
    level_hard: number;
};

export type OnAIAnswerPayload = {
    aiAnswer: Answer;
    aiCorrect: boolean;
    aiTime: number;
};

export type UseAIOpponentParams = {
    question: Question | null;
    difficulty: Difficulty;
    aiProfile?: AIProfile | null;
    playerAvgTime: number;
    playerAccuracy: number;
    onAIAnswer: (payload: OnAIAnswerPayload) => void;
};
