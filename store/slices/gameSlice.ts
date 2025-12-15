import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type QuestionResult = {
    questionId: string;
    correct: boolean;
    timeSpent: number;
    timeLimit: number;
    xpEarned: number;
};

type AIResult = {
    questionId: string;
    correct: boolean;
    timeSpent: number;
};

interface GameState {
    results: QuestionResult[];
    aiResults: AIResult[];
    startTimePerQuestion: number | null;
}

const initialState: GameState = {
    results: [],
    aiResults: [],
    startTimePerQuestion: null,
};

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

const calcQuestionXp = (correct: boolean, timeSpent: number, timeLimit: number) => {
    if (!correct) return 0;

    const limit = Math.max(1, timeLimit);
    const spent = clamp(timeSpent, 0, limit);

    const base = 20;
    const speedPct = 1 - spent / limit;
    const speedBonus = Math.round(10 * clamp(speedPct, 0, 1));

    const perfectBonus = spent <= limit * 0.25 ? 5 : 0;

    return base + speedBonus + perfectBonus;
};

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        startQuestion: (state) => {
            state.startTimePerQuestion = Date.now();
        },

        finishQuestion: (
            state,
            action: PayloadAction<{
                questionId: string;
                correct: boolean;
                timeLimit: number;
                timeSpent?: number;
            }>
        ) => {
            const now = Date.now();

            const fallback =
                state.startTimePerQuestion !== null
                    ? (now - state.startTimePerQuestion) / 1000
                    : 0;

            const rawSpent =
                typeof action.payload.timeSpent === "number"
                    ? action.payload.timeSpent
                    : fallback;

            const timeLimit = Math.max(1, action.payload.timeLimit);
            const timeSpent = clamp(rawSpent, 0, timeLimit);

            const xpEarned = calcQuestionXp(action.payload.correct, timeSpent, timeLimit);

            state.results.push({
                questionId: action.payload.questionId,
                correct: action.payload.correct,
                timeSpent,
                timeLimit,
                xpEarned,
            });

            state.startTimePerQuestion = null;
        },

        registerAIAnswer: (
            state,
            action: PayloadAction<{
                questionId: string;
                correct: boolean;
                timeSpent: number;
            }>
        ) => {
            state.aiResults.push({
                questionId: action.payload.questionId,
                correct: action.payload.correct,
                timeSpent: action.payload.timeSpent,
            });
        },

        resetGame: (state) => {
            state.results = [];
            state.aiResults = [];
            state.startTimePerQuestion = null;
        },
    },
});

export const { startQuestion, finishQuestion, registerAIAnswer, resetGame } =
    gameSlice.actions;

export default gameSlice.reducer;
