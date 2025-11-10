"use client";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { addEnrollment, removeEnrollment } from "../Enrollments/reducer";
import { RootState } from "../store";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";
export default function Dashboard() {
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
    const router = useRouter();
    const [showAllCourses, setShowAllCourses] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [course, setCourse] = useState<any>({
        _id: "0", name: "New Course", number: "New Number",
        startDate: "2023-09-10", endDate: "2023-12-15",
        image: "/images/reactjs.jpg", description: "New Description"
    });

    // Redirect to sign-in if not logged in
    useEffect(() => {
        if (!currentUser) {
            router.push("/Account/Signin");
        }
    }, [currentUser, router]);

    // Don't render anything if not logged in (will redirect)
    if (!currentUser) {
        return null;
    }
    const isEnrolled = (courseId: string) => {
        if (!currentUser) return false;
        return enrollments.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (e: any) => e.user === currentUser._id && e.course === courseId
        );
    };

    const handleEnroll = (courseId: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (currentUser) {
            dispatch(addEnrollment({ user: currentUser._id, course: courseId }));
        }
    };

    const handleUnenroll = (courseId: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (currentUser) {
            dispatch(removeEnrollment({ userId: currentUser._id, courseId }));
        }
    };

    const handleCourseClick = (courseId: string, event: React.MouseEvent) => {
        if (!currentUser) return;
        // Faculty can always access courses
        if (currentUser.role === "FACULTY") {
            router.push(`/Courses/${courseId}/Home`);
            return;
        }
        // Students can only access if enrolled
        if (isEnrolled(courseId)) {
            router.push(`/Courses/${courseId}/Home`);
        } else {
            event.preventDefault();
            // Stay on Dashboard if not enrolled
        }
    };

    return (
        <div id="wd-dashboard">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 id="wd-dashboard-title" className="mb-0">Dashboard</h1>
                <Button
                    variant="primary"
                    onClick={() => setShowAllCourses(!showAllCourses)}
                >
                    Enrollments
                </Button>
            </div>
            <hr />
            {currentUser?.role === "FACULTY" && (
                <>
                    <h5>New Course
                        <button className="btn btn-primary float-end"
                            id="wd-add-new-course-click"
                            onClick={() => {
                                dispatch(addNewCourse(course));
                                // Reset form after adding
                                setCourse({
                                    _id: "0", name: "New Course", number: "New Number",
                                    startDate: "2023-09-10", endDate: "2023-12-15",
                                    image: "/images/reactjs.jpg", description: "New Description"
                                });
                            }} > Add </button>
                        <button className="btn btn-warning float-end me-2"
                            onClick={() => dispatch(updateCourse(course))} id="wd-update-course-click">
                            Update </button>
                    </h5>
                    <br />
                    <FormControl onChange={(e) => setCourse({ ...course, name: e.target.value })} value={course.name} className="mb-2" />
                    <FormControl
                        as="textarea"
                        onChange={(e) => setCourse({ ...course, description: e.target.value })}
                        value={course.description}
                        rows={3}
                    />
                    <hr />
                </>
            )}

            <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {courses
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .filter((course: any) => {
                            if (!currentUser) return false;
                            // Faculty can see all courses
                            if (currentUser.role === "FACULTY") return true;
                            // If showAllCourses is true, show all courses; otherwise show only enrolled
                            if (showAllCourses) return true;
                            // Students can only see courses they're enrolled in
                            return isEnrolled(course._id);
                        })

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .map((course: any, key: number) => {
                            const enrolled = isEnrolled(course._id);
                            return (
                                <Col key={key} className="wd-dashboard-course" style={{ width: "300px" }}>
                                    <Card>
                                        <div onClick={(e) => handleCourseClick(course._id, e)}>
                                            <Link href={`/Courses/${course._id}/Home`}
                                                className="wd-dashboard-course-link text-decoration-none text-dark" >
                                                <CardImg src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
                                                <CardBody className="card-body">
                                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                                        {course.name} </CardTitle>
                                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                                        {course.description} </CardText>
                                                    <Button variant="primary"> Go </Button>
                                                    {currentUser?.role === "FACULTY" && (
                                                        <>
                                                            <button onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                dispatch(deleteCourse(course._id));
                                                            }} className="btn btn-danger float-end"
                                                                id="wd-delete-course-click">
                                                                Delete
                                                            </button>
                                                            <button id="wd-edit-course-click"
                                                                onClick={(event) => {
                                                                    event.preventDefault();
                                                                    event.stopPropagation();
                                                                    setCourse(course);
                                                                }}
                                                                className="btn btn-warning me-2 float-end" >
                                                                Edit
                                                            </button>
                                                        </>
                                                    )}
                                                    {currentUser?.role !== "FACULTY" && showAllCourses && (
                                                        <button
                                                            onClick={(e) => enrolled ? handleUnenroll(course._id, e) : handleEnroll(course._id, e)}
                                                            className={`btn float-end ${enrolled ? "btn-danger" : "btn-success"}`}
                                                        >
                                                            {enrolled ? "Unenroll" : "Enroll"}
                                                        </button>
                                                    )}
                                                </CardBody>
                                            </Link>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                </Row>
            </div>
        </div>);
}