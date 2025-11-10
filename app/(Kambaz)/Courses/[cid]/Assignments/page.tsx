"use client"
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { BsGripVertical } from 'react-icons/bs';
import { FaCheckCircle, FaSearch, FaPlus, FaCaretDown, FaTrash } from 'react-icons/fa';
import { IoEllipsisVertical } from 'react-icons/io5';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { deleteAssignment } from "./reducer";
import { RootState } from "../../../store";
import { useState } from 'react';

export default function Assignments() {
    const { cid } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const handleDelete = (assignmentId: string) => {
        dispatch(deleteAssignment(assignmentId));
        setDeleteConfirm(null);
    };

    const isFaculty = currentUser?.role === "FACULTY";

    return (
        <div id="wd-assignments" className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="position-relative" style={{ width: "300px" }}>
                    <FaSearch className="position-absolute text-muted"
                        style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                        type="text"
                        className="form-control ps-5"
                        placeholder="Search for Assignment"
                    />
                </div>
                {isFaculty && (
                    <div>
                        <button className="btn btn-secondary me-2">
                            <FaPlus className="me-1" /> Group
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => router.push(`/Courses/${cid}/Assignments/new`)}
                        >
                            <FaPlus className="me-1" /> Assignment
                        </button>
                    </div>
                )}
            </div>

            <ListGroup className="rounded-0">
                <ListGroupItem className="p-0 border-0">
                    <div className="p-3 bg-light border d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <BsGripVertical className="me-2 fs-4 text-muted" />
                            <FaCaretDown className="me-2" />
                            <strong>ASSIGNMENTS</strong>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="badge rounded-pill border text-dark bg-light px-3 py-2 me-3">
                                40% of Total
                            </span>
                            {isFaculty && (
                                <>
                                    <FaPlus className="text-muted me-3" />
                                    <IoEllipsisVertical className="text-muted" />
                                </>
                            )}
                        </div>
                    </div>

                    <ListGroup className="rounded-0">
                        {assignments
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .filter((assignment: any) => assignment.course === cid)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .map((assignment: any) => (
                                <ListGroupItem
                                    key={assignment._id}
                                    className="border position-relative"
                                    style={{ borderLeft: "5px solid #28a745 !important" }}
                                >
                                    {deleteConfirm === assignment._id && (
                                        <div className="position-absolute top-0 start-0 w-100 h-100
                                            d-flex align-items-center justify-content-center"
                                            style={{ backgroundColor: "rgba(255,255,255,0.95)", zIndex: 10 }}>
                                            <div className="bg-white border p-3 rounded shadow">
                                                <p>Are you sure you want to delete this assignment?</p>
                                                <button
                                                    className="btn btn-danger me-2"
                                                    onClick={() => handleDelete(assignment._id)}
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => setDeleteConfirm(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="d-flex align-items-start py-2">
                                        <BsGripVertical className="me-2 fs-4 text-muted" />
                                        {isFaculty && (
                                            <FaEdit className="me-3 fs-5 text-success mt-1" />
                                        )}
                                        <div className="flex-grow-1">
                                            <Link
                                                href={`/Courses/${cid}/Assignments/${assignment._id}`}
                                                className="text-decoration-none text-dark"
                                            >
                                                <strong>{assignment.title}</strong>
                                            </Link>
                                            <div className="small">
                                                <span className="text-danger">Multiple Modules</span>
                                                <span className="text-muted"> | Not available until {assignment.availableDate} | </span>
                                            </div>
                                            <div className="small text-muted">
                                                <strong>Due</strong> {assignment.dueDate} | {assignment.points} pts
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <FaCheckCircle className="text-success fs-5 me-3" />
                                            {isFaculty && (
                                                <FaTrash
                                                    className="text-danger fs-5 me-3"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => setDeleteConfirm(assignment._id)}
                                                />
                                            )}
                                            <IoEllipsisVertical className="text-muted fs-4" />
                                        </div>
                                    </div>
                                </ListGroupItem>
                            ))}
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div>
    );
}