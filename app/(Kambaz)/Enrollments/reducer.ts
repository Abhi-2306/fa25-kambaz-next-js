/* eslint-disable */
import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../Database";
import { v4 as uuidv4 } from "uuid";


const initialState = {
    enrollments: enrollments,
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        addEnrollment: (state, { payload: enrollment }) => {
            const exists = state.enrollments.some(
                (e: any) => e.user === enrollment.user && e.course === enrollment.course
            );
            if (!exists) {
                const newEnrollment: any = {
                    _id: uuidv4(),
                    user: enrollment.user,
                    course: enrollment.course,
                };
                state.enrollments = [...state.enrollments, newEnrollment] as any;
                if (typeof window !== "undefined") {
                    localStorage.setItem("enrollments", JSON.stringify(state.enrollments));
                }
            }
        },
        removeEnrollment: (state, { payload: { userId, courseId } }) => {
            state.enrollments = state.enrollments.filter(
                (e: any) => !(e.user === userId && e.course === courseId)
            );
            if (typeof window !== "undefined") {
                localStorage.setItem("enrollments", JSON.stringify(state.enrollments));
            }
        },
        setEnrollments: (state, { payload: enrollments }) => {
            state.enrollments = enrollments as any;
            if (typeof window !== "undefined") {
                localStorage.setItem("enrollments", JSON.stringify(enrollments));
            }
        },
        loadEnrollmentsFromStorage: (state) => {
            if (typeof window !== "undefined") {
                const storedEnrollments = localStorage.getItem("enrollments");
                if (storedEnrollments) {
                    try {
                        state.enrollments = JSON.parse(storedEnrollments) as any;
                    } catch (e) {
                    }
                }
            }
        },
    },
});

export const { addEnrollment, removeEnrollment, setEnrollments, loadEnrollmentsFromStorage } =
    enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;

