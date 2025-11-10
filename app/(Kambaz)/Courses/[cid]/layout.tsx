"use client";
import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import Breadcrumb from "./Breadcrumb";

export default function CoursesLayout({ children }: { children: ReactNode }) {
    const { cid } = useParams();
    const router = useRouter();
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const course = courses.find((course: any) => course._id === cid);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            router.push("/Dashboard");
            return;
        }
        // Faculty can always access courses
        if (currentUser.role === "FACULTY") {
            return;
        }
        // Students must be enrolled to access
        const isEnrolled = enrollments.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (e: any) => e.user === currentUser._id && e.course === cid
        );
        if (!isEnrolled) {
            router.push("/Dashboard");
        }
    }, [currentUser, enrollments, cid, router]);

    // If not enrolled (and not faculty), don't render the course content
    if (currentUser && currentUser.role !== "FACULTY") {
        const isEnrolled = enrollments.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (e: any) => e.user === currentUser._id && e.course === cid
        );
        if (!isEnrolled) {
            return null; // Will redirect via useEffect
        }
    }

    return (
        <div id="wd-courses">
            <h2 className="text-danger">
                <FaAlignJustify
                    className="me-4 fs-4 mb-1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowSidebar(!showSidebar)}
                />
                <Breadcrumb course={course} />
            </h2>
            <hr />
            <div className="d-flex">
                {showSidebar && (
                    <div className="d-none d-md-block">
                        <CourseNavigation />
                    </div>
                )}
                <div className="flex-fill">
                    {children}
                </div>
            </div>
        </div>
    );
}