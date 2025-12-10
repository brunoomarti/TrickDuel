import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: "light",
    globalLoading: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setTheme(state, action) {
            state.theme = action.payload;
        },
        setGlobalLoading(state, action) {
            state.globalLoading = action.payload;
        },
    },
});

export const { setTheme, setGlobalLoading } = uiSlice.actions;
export default uiSlice.reducer;
