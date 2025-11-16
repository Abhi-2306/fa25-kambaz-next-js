/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse, setCourses } from "../Courses/reducer";
import { RootState } from "../store";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as client from "../Courses/client";

import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";

export default function Dashboard() {
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const router = useRouter();
    const [showAllCourses, setShowAllCourses] = useState(false);

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
            if (showAllCourses) {
                const allCourses = await client.fetchAllCourses();
                dispatch(setCourses(allCourses));
            } else {
                const enrolledCourses = await client.findMyCourses();
                dispatch(setCourses(enrolledCourses));
            }
        } catch (error) {
            console.error(error);
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

    // Function to handle course navigation
    const navigateToCourse = (courseId: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        router.push(`/Courses/${courseId}/Home`);
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

            <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {courses.map((course: any) => (
                        <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                            <Card>
                                <div className="wd-dashboard-course-link">
                                    <CardImg
                                        src="/images/reactjs.jpg"
                                        variant="top"
                                        width="100%"
                                        height={160}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigateToCourse(course._id)}
                                    />
                                    <CardBody className="card-body">
                                        <CardTitle
                                            className="wd-dashboard-course-title text-nowrap overflow-hidden"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigateToCourse(course._id)}
                                        >
                                            {course.name}
                                        </CardTitle>
                                        <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                            {course.description}
                                        </CardText>
                                        <Button
                                            variant="primary"
                                            onClick={(e) => navigateToCourse(course._id, e)}
                                        >
                                            Go
                                        </Button>
                                        {currentUser?.role === "FACULTY" && (
                                            <>
                                                <button onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    onDeleteCourse(course._id);
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
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (course.enrolled) {
                                                        await client.unenrollFromCourse(currentUser._id, course._id);
                                                    } else {
                                                        await client.enrollInCourse(currentUser._id, course._id);
                                                    }
                                                    fetchCourses();
                                                }}
                                                className={`btn float-end ${course.enrolled ? "btn-danger" : "btn-success"}`}
                                            >
                                                {course.enrolled ? "Unenroll" : "Enroll"}
                                            </button>
                                        )}
                                    </CardBody>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}