import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeContent: "home",
};

const activeContentSlice = createSlice({
    name: "activeContent",
    initialState,
    reducers: {
        setActiveContent: (state, action) => {
            state.activeContent = action.payload;
        },
    },
});

export const { setActiveContent } = activeContentSlice.actions;
export default activeContentSlice.reducer;