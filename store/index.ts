import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import gameReducer from "./slices/gameSlice";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        game: gameReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
