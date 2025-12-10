import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type QuestionResult = {
    questionId: string;
    correct: boolean;
    timeSpent: number;
};

interface GameState {
    results: QuestionResult[];
    startTimePerQuestion: number | null;
}

const initialState: GameState = {
    results: [],
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
            action: PayloadAction<{ questionId: string; correct: boolean }>
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
            });

            state.startTimePerQuestion = null;
        },

        resetGame: (state) => {
            state.results = [];
            state.startTimePerQuestion = null;
        },
    },
});

export const { startQuestion, finishQuestion, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
