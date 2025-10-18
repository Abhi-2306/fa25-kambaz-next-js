"use client"
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { BsGripVertical } from 'react-icons/bs';
import { FaCheckCircle, FaSearch, FaPlus, FaCaretDown } from 'react-icons/fa';
import { IoEllipsisVertical } from 'react-icons/io5';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as db from "../../../Database";

export default function Assignments() {
    const { cid } = useParams();
    const assignments = db.assignments;

    return (
        <div id="wd-assignments" className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="position-relative" style={{ width: "300px" }}>
                    <FaSearch className="position-absolute text-muted" style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                        type="text"
                        className="form-control ps-5"
                        placeholder="Search..."
                    />
                </div>
                <div>
                    <button className="btn btn-secondary me-2">
                        <FaPlus className="me-1" /> Group
                    </button>
                    <button className="btn btn-danger">
                        <FaPlus className="me-1" /> Assignment
                    </button>
                </div>
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
                            <span className="badge rounded-pill border text-dark bg-light px-3 py-2 me-3">40% of Total</span>
                            <FaPlus className="text-muted me-3" />
                            <IoEllipsisVertical className="text-muted" />
                        </div>
                    </div>

                    <ListGroup className="rounded-0">
                        {assignments
                            .filter((assignment: any) => assignment.course === cid)
                            .map((assignment: any) => (
                                <ListGroupItem
                                    key={assignment._id}
                                    className="border"
                                    style={{ borderLeft: "5px solid #28a745 !important" }}
                                >
                                    <div className="d-flex align-items-start py-2">
                                        <BsGripVertical className="me-2 fs-4 text-muted" />
                                        <FaEdit className="me-3 fs-5 text-success mt-1" />
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
                                            <FaCheckCircle className="text-success fs-5 me-4" />
                                            <IoEllipsisVertical className="text-muted fs-4" />
                                        </div>
                                    </div>
                                </ListGroupItem>
                            ))
                        }
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div>
    );
}