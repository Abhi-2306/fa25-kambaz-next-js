"use client"
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';

export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor" className="container mt-4">
            <Form>
                <Form.Group className="mb-4">
                    <Form.Label htmlFor="wd-name">Assignment Name</Form.Label>
                    <Form.Control
                        type="text"
                        id="wd-name"
                        defaultValue="A1"
                        suppressHydrationWarning={true}
                    />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control
                        as="textarea"
                        rows={12}
                        id="wd-description"
                        defaultValue={`The assignment is available online

Submit a link to the landing page of your Web application running on Netlify.

The landing page should include the following:

• Your full name and section
• Links to each of the lab assignments
• Link to the Kanbaz application
• Links to all relevant source code repositories

The Kanbaz application should include a link to navigate back to the landing page.`}
                        suppressHydrationWarning={true}
                        style={{ resize: 'none' }}
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
                            defaultValue={100}
                            suppressHydrationWarning={true}
                        />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={3} className="text-end">
                        <Form.Label htmlFor="wd-group">Assignment Group</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Select
                            id="wd-group"
                            defaultValue="ASSIGNMENTS"
                            suppressHydrationWarning={true}
                        >
                            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                            <option value="QUIZZES">QUIZZES</option>
                            <option value="EXAMS">EXAMS</option>
                            <option value="PROJECTS">PROJECTS</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={3} className="text-end">
                        <Form.Label htmlFor="wd-display-grade-as">Display Grade as</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Select
                            id="wd-display-grade-as"
                            defaultValue="Percentage"
                            suppressHydrationWarning={true}
                        >
                            <option value="Percentage">Percentage</option>
                            <option value="Points">Points</option>
                            <option value="Complete/Incomplete">Complete/Incomplete</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={3} className="text-end">
                        <Form.Label htmlFor="wd-submission-type">Submission Type</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Card className="p-3">
                            <Form.Select
                                id="wd-submission-type"
                                defaultValue="Online"
                                className="mb-3"
                                suppressHydrationWarning={true}
                            >
                                <option value="Online">Online</option>
                                <option value="On Paper">On Paper</option>
                                <option value="External Tool">External Tool</option>
                            </Form.Select>

                            <div>
                                <Form.Label className="fw-bold">Online Entry Options</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    id="wd-text-entry"
                                    label="Text Entry"
                                    suppressHydrationWarning={true}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="wd-website-url"
                                    label="Website URL"
                                    defaultChecked
                                    suppressHydrationWarning={true}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="wd-media-recordings"
                                    label="Media Recordings"
                                    suppressHydrationWarning={true}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="wd-student-annotation"
                                    label="Student Annotation"
                                    suppressHydrationWarning={true}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="wd-file-upload"
                                    label="File Uploads"
                                    suppressHydrationWarning={true}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={3} className="text-end">
                        <Form.Label>Assign</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Card className="p-3">
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="wd-assign-to" className="fw-bold">Assign to</Form.Label>
                                <div className="form-control bg-light">
                                    <span className="badge bg-secondary text-dark me-1">
                                        Everyone
                                        <button type="button" className="btn-close btn-sm ms-2" aria-label="Remove"></button>
                                    </span>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="wd-due-date" className="fw-bold">Due</Form.Label>
                                <div className="input-group">
                                    <Form.Control
                                        type="text"
                                        id="wd-due-date"
                                        defaultValue="May 13, 2024, 11:59 PM"
                                        suppressHydrationWarning={true}
                                    />
                                    <button className="btn btn-outline-secondary" type="button">
                                        <FaCalendarAlt />
                                    </button>
                                </div>
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label htmlFor="wd-available-from" className="fw-bold">Available from</Form.Label>
                                        <div className="input-group">
                                            <Form.Control
                                                type="text"
                                                id="wd-available-from"
                                                defaultValue="May 6, 2024, 12:00 AM"
                                                suppressHydrationWarning={true}
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
                                                type="text"
                                                id="wd-available-until"
                                                defaultValue="May 20, 2024, 11:59 PM"
                                                suppressHydrationWarning={true}
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
                    <Button variant="secondary" className="me-2" id="wd-cancel">
                        Cancel
                    </Button>
                    <Button variant="danger" id="wd-save">
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    );
}