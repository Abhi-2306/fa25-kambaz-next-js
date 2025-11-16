/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../Courses/reducer";
import { RootState } from "../store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as client from "../Courses/client";

import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";

export default function Dashboard() {
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const router = useRouter();
    const [showAllCourses, setShowAllCourses] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [course, setCourse] = useState<any>({
        _id: "0", name: "New Course", number: "New Number",
        startDate: "2023-09-10", endDate: "2023-12-15",
        image: "/images/reactjs.jpg", description: "New Description"
    });

    const onAddNewCourse = async () => {
        const newCourse = await client.createCourse(course);
        dispatch(setCourses([...courses, newCourse]));
    };

    const onDeleteCourse = async (courseId: string) => {
        const status = await client.deleteCourse(courseId);
        dispatch(setCourses(courses.filter((course: any) => course._id !== courseId)));
    };

    const onUpdateCourse = async () => {
        await client.updateCourse(course);
        dispatch(setCourses(courses.map((c: any) => {
            if (c._id === course._id) { return course; }
            else { return c; }
        })));
    };

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            if (currentUser?.role === "FACULTY") {
                const allCourses = await client.fetchAllCourses();
                dispatch(setCourses(allCourses));
            } else if (showAllCourses) {
                const allCourses = await client.fetchAllCourses();
                dispatch(setCourses(allCourses));
            } else {
                const enrolledCourses = await client.findMyCourses();
                dispatch(setCourses(enrolledCourses));
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            alert("Failed to fetch courses. Please try refreshing the page.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!currentUser) {
            router.push("/Account/Signin");
        } else {
            fetchCourses();
        }
    }, [currentUser, showAllCourses]);

    if (!currentUser) {
        return null;
    }

    const navigateToCourse = (courseId: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        router.push(`/Courses/${courseId}/Home`);
    };

    const handleEnrollment = async (e: React.MouseEvent, course: any) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setIsLoading(true);
            if (course.enrolled) {
                await client.unenrollFromCourse(currentUser._id, course._id);
                alert("Successfully unenrolled from " + course.name);
            } else {
                await client.enrollInCourse(currentUser._id, course._id);
                alert("Successfully enrolled in " + course.name + "! You can now access the course.");
            }

            await fetchCourses();

            if (!course.enrolled && showAllCourses) {
                setShowAllCourses(false);
            }
        } catch (error: any) {
            console.error("Enrollment error:", error);
            alert(error.response?.data?.message || "Failed to update enrollment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="wd-dashboard">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 id="wd-dashboard-title" className="mb-0">Dashboard</h1>
                {currentUser?.role !== "FACULTY" && (
                    <Button
                        onClick={() => setShowAllCourses(!showAllCourses)}
                        disabled={isLoading}
                    >
                    Enrollments
                    </Button>
                )}
            </div>
            <hr />

            {currentUser?.role === "FACULTY" && (
                <>
                    <h5>New Course
                        <button className="btn btn-primary float-end"
                            id="wd-add-new-course-click"
                            onClick={onAddNewCourse} > Add </button>
                        <button className="btn btn-warning float-end me-2"
                            onClick={onUpdateCourse} id="wd-update-course-click">
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

            <h2 id="wd-dashboard-published">
                {showAllCourses ? "All Available" : "Enrolled"} Courses ({courses.length})
            </h2>
            <hr />

            {isLoading ? (
                <div className="text-center">
                    <p>Loading courses...</p>
                </div>
            ) : (
                <div id="wd-dashboard-courses">
                    <Row xs={1} md={5} className="g-4">
                        {courses.map((course: any) => {
                            const isEnrolled = !showAllCourses || course.enrolled;

                            return (
                                <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                                    <Card>
                                        <div className="wd-dashboard-course-link">
                                            <CardImg
                                                src="/images/reactjs.jpg"
                                                variant="top"
                                                width="100%"
                                                height={160}
                                                style={{
                                                    cursor: isEnrolled || currentUser?.role === "FACULTY" ? 'pointer' : 'default',
                                                    opacity: isEnrolled || currentUser?.role === "FACULTY" ? 1 : 0.7
                                                }}
                                                onClick={() => {
                                                    if (isEnrolled || currentUser?.role === "FACULTY") {
                                                        navigateToCourse(course._id);
                                                    } else {
                                                        alert("Please enroll in this course first to access it.");
                                                    }
                                                }}
                                            />
                                            <CardBody className="card-body">
                                                <CardTitle
                                                    className="wd-dashboard-course-title text-nowrap overflow-hidden"
                                                    style={{
                                                        cursor: isEnrolled || currentUser?.role === "FACULTY" ? 'pointer' : 'default'
                                                    }}
                                                    onClick={() => {
                                                        if (isEnrolled || currentUser?.role === "FACULTY") {
                                                            navigateToCourse(course._id);
                                                        } else {
                                                            alert("Please enroll in this course first to access it.");
                                                        }
                                                    }}
                                                >
                                                    {course.name}
                                                </CardTitle>
                                                <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                                    {course.description}
                                                </CardText>

                                                {(isEnrolled || currentUser?.role === "FACULTY") && (
                                                    <Button
                                                        variant="primary"
                                                        onClick={(e) => navigateToCourse(course._id, e)}
                                                        disabled={isLoading}
                                                    >
                                                        Go
                                                    </Button>
                                                )}

                                                {currentUser?.role === "FACULTY" && (
                                                    <>
                                                        <button
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                onDeleteCourse(course._id);
                                                            }}
                                                            className="btn btn-danger float-end"
                                                            id="wd-delete-course-click"
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            id="wd-edit-course-click"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                setCourse(course);
                                                            }}
                                                            className="btn btn-warning me-2 float-end"
                                                        >
                                                            Edit
                                                        </button>
                                                    </>
                                                )}

                                                {currentUser?.role !== "FACULTY" && showAllCourses && (
                                                    <button
                                                        onClick={(e) => handleEnrollment(e, course)}
                                                        className={`btn float-end ${course.enrolled ? "btn-danger" : "btn-success"}`}
                                                        disabled={isLoading}
                                                    >
                                                        {course.enrolled ? "Unenroll" : "Enroll"}
                                                    </button>
                                                )}
                                            </CardBody>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </div>
            )}
        </div>
    );
}