import { configureStore } from "@reduxjs/toolkit";
import activeContentReducer from "./features/activeContent/activeContentSlice";

export const store = configureStore({
    reducer: {
        activeContent: activeContentReducer,
        // ... (các reducer khác)
    },
});