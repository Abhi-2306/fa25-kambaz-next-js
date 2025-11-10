"use client";
import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import Breadcrumb from "./Breadcrumb";
import { Offcanvas } from "react-bootstrap";

export default function CoursesLayout({ children }: { children: ReactNode }) {
    const { cid } = useParams();
    const router = useRouter();
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const course = courses.find((course: any) => course._id === cid);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            router.push("/Dashboard");
            return;
        }
        if (currentUser.role === "FACULTY") {
            return;
        }
        const isEnrolled = enrollments.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (e: any) => e.user === currentUser._id && e.course === cid
        );
        if (!isEnrolled) {
            router.push("/Dashboard");
        }
    }, [currentUser, enrollments, cid, router]);

    if (currentUser && currentUser.role !== "FACULTY") {
        const isEnrolled = enrollments.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (e: any) => e.user === currentUser._id && e.course === cid
        );
        if (!isEnrolled) {
            return null;
        }
    }

    return (
        <div id="wd-courses">
            <h2 className="text-danger">
                <FaAlignJustify
                    className="me-4 fs-4 mb-1 d-md-none"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowMobileSidebar(true)}
                />
                <FaAlignJustify
                    className="me-4 fs-4 mb-1 d-none d-md-inline-block"
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

            <Offcanvas
                show={showMobileSidebar}
                onHide={() => setShowMobileSidebar(false)}
                className="d-md-none"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="text-danger">
                        {course?.name || "Course Navigation"}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div onClick={() => setShowMobileSidebar(false)}>
                        <CourseNavigation />
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}