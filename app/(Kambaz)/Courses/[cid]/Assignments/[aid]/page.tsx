"use client"
import { Form, Card, Row, Col } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "../reducer";
import { RootState } from "../../../../store";
import { useState, useEffect } from 'react';

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);

    const isNewAssignment = aid === 'new';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingAssignment = isNewAssignment ? null : assignments.find((a: any) => a._id === aid);

    const [assignment, setAssignment] = useState(() => {
        if (existingAssignment) {
            return existingAssignment;
        }
        return {
            title: "",
            description: "",
            points: 100,
            dueDate: "2024-05-13",
            availableDate: "2024-05-06",
            untilDate: "2024-05-20",
            course: cid,
        };
    });

    useEffect(() => {
        if (!isNewAssignment) {
            if (existingAssignment) {
                // Update state when existing assignment is found
                setAssignment(existingAssignment);
            } else {
                // Assignment not found, redirect back
                router.push(`/Courses/${cid}/Assignments`);
            }
        }
    }, [isNewAssignment, existingAssignment, cid, router]);

    const handleSave = () => {
        if (isNewAssignment) {
            dispatch(addAssignment(assignment));
        } else {
            dispatch(updateAssignment(assignment));
        }
        router.push(`/Courses/${cid}/Assignments`);
    };

    const isFaculty = currentUser?.role === "FACULTY";
    if (!isFaculty && isNewAssignment) {
        router.push(`/Courses/${cid}/Assignments`);
        return null;
    }

    return (
        <div id="wd-assignments-editor" className="container mt-4">
            <Form>
                <Form.Group className="mb-4">
                    <Form.Label htmlFor="wd-name">Assignment Name</Form.Label>
                    <Form.Control
                        type="text"
                        id="wd-name"
                        value={assignment.title}
                        onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
                        disabled={!isFaculty}
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Control
                        as="textarea"
                        rows={12}
                        id="wd-description"
                        value={assignment.description}
                        onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
                        style={{ resize: 'none' }}
                        disabled={!isFaculty}
                    />
                </Form.Group>

                <Row className="mb-3">
                    <Col md={3} className="text-end">
                        <Form.Label htmlFor="wd-points">Points</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            type="number"
                            id="wd-points"
                            value={assignment.points}
                            onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) })}
                            disabled={!isFaculty}
                        />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={3} className="text-end">
                        <Form.Label>Assign</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Card className="p-3">
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="wd-due-date" className="fw-bold">Due</Form.Label>
                                <div className="input-group">
                                    <Form.Control
                                        type="date"
                                        id="wd-due-date"
                                        value={assignment.dueDate}
                                        onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                                        disabled={!isFaculty}
                                    />
                                    <button className="btn btn-outline-secondary" type="button">
                                        <FaCalendarAlt />
                                    </button>
                                </div>
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label htmlFor="wd-available-from" className="fw-bold">
                                            Available from
                                        </Form.Label>
                                        <div className="input-group">
                                            <Form.Control
                                                type="date"
                                                id="wd-available-from"
                                                value={assignment.availableDate}
                                                onChange={(e) => setAssignment({ ...assignment, availableDate: e.target.value })}
                                                disabled={!isFaculty}
                                            />
                                            <button className="btn btn-outline-secondary" type="button">
                                                <FaCalendarAlt />
                                            </button>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label htmlFor="wd-available-until" className="fw-bold">Until</Form.Label>
                                        <div className="input-group">
                                            <Form.Control
                                                type="date"
                                                id="wd-available-until"
                                                value={assignment.untilDate}
                                                onChange={(e) => setAssignment({ ...assignment, untilDate: e.target.value })}
                                                disabled={!isFaculty}
                                            />
                                            <button className="btn btn-outline-secondary" type="button">
                                                <FaCalendarAlt />
                                            </button>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                <hr className="my-4" />

                <div className="d-flex justify-content-end">
                    {isFaculty ? (
                        <>
                            <Link href={`/Courses/${cid}/Assignments`} className="btn btn-secondary me-2">
                                Cancel
                            </Link>
                            <button type="button" className="btn btn-danger" onClick={handleSave}>
                                Save
                            </button>
                        </>
                    ) : (
                        <Link href={`/Courses/${cid}/Assignments`} className="btn btn-secondary">
                            Back
                        </Link>
                    )}
                </div>
            </Form>
        </div>
    );
}