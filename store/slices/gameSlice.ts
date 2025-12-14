import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type QuestionResult = {
    questionId: string;
    correct: boolean;
    timeSpent: number;
    timeLimit: number;
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
            }>
        ) => {
            const now = Date.now();
            const diff =
                state.startTimePerQuestion !== null
                    ? (now - state.startTimePerQuestion) / 1000
                    : 0;

            state.results.push({
                questionId: action.payload.questionId,
                correct: action.payload.correct,
                timeSpent: diff,
                timeLimit: action.payload.timeLimit,
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

export const {
    startQuestion,
    finishQuestion,
    registerAIAnswer,
    resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
