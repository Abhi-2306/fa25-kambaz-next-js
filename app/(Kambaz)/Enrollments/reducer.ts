import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../Database";
import { v4 as uuidv4 } from "uuid";

// Don't load from localStorage on initialization - only on sign in
// This ensures refreshes reset to database state
const initialState = {
    enrollments: enrollments,
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        addEnrollment: (state, { payload: enrollment }) => {
            // Check if enrollment already exists
            const exists = state.enrollments.some(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (e: any) => e.user === enrollment.user && e.course === enrollment.course
            );
            if (!exists) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newEnrollment: any = {
                    _id: uuidv4(),
                    user: enrollment.user,
                    course: enrollment.course,
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                state.enrollments = [...state.enrollments, newEnrollment] as any;
                // Save to localStorage for sign out/in persistence
                if (typeof window !== "undefined") {
                    localStorage.setItem("enrollments", JSON.stringify(state.enrollments));
                }
            }
        },
        removeEnrollment: (state, { payload: { userId, courseId } }) => {
            state.enrollments = state.enrollments.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (e: any) => !(e.user === userId && e.course === courseId)
            );
            // Save to localStorage for sign out/in persistence
            if (typeof window !== "undefined") {
                localStorage.setItem("enrollments", JSON.stringify(state.enrollments));
            }
        },
        setEnrollments: (state, { payload: enrollments }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            state.enrollments = enrollments as any;
            // Save to localStorage for sign out/in persistence
            if (typeof window !== "undefined") {
                localStorage.setItem("enrollments", JSON.stringify(enrollments));
            }
        },
        loadEnrollmentsFromStorage: (state) => {
            // Load enrollments from localStorage (called on sign in)
            if (typeof window !== "undefined") {
                const storedEnrollments = localStorage.getItem("enrollments");
                if (storedEnrollments) {
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        state.enrollments = JSON.parse(storedEnrollments) as any;
                    } catch (e) {
                        // Invalid stored enrollments, keep current state
                    }
                }
            }
        },
    },
});

export const { addEnrollment, removeEnrollment, setEnrollments, loadEnrollmentsFromStorage } =
    enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;

