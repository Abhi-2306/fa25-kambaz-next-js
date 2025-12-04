/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    quizzes: [] as any[],
    currentQuiz: null as any,
};

const quizzesSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        setQuizzes: (state, action) => {
            state.quizzes = action.payload;
        },
        setCurrentQuiz: (state, action) => {
            state.currentQuiz = action.payload;
        },
        addQuiz: (state, action) => {
            state.quizzes.push(action.payload);
        },
        updateQuiz: (state, action) => {
            state.quizzes = state.quizzes.map((q) =>
                q._id === action.payload._id ? action.payload : q
            );
        },
        deleteQuiz: (state, action) => {
            state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
        },
    },
});

export const { setQuizzes, setCurrentQuiz, addQuiz, updateQuiz, deleteQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;