import Link from "next/link";
import { Card, CardBody, CardImg, CardText, CardTitle, Col, Row, Button } from "react-bootstrap";
export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-5">
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" alt="" src="/images/html.jpg" width="100%" height={150} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> CS1234 HTML Fundamentals </CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Learn the building blocks of web pages with HTML structure and semantics
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1235" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" alt="" src="/images/css.png" width="100%" height={150} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> CS1235 CSS Styling </CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Master visual design with CSS layouts, animations, and responsive design
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1236" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" alt="" src="/images/javascript.avif" width="100%" height={150} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> CS1236 JavaScript Programming </CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Build interactive web applications with modern JavaScript ES6+
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1237" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" alt="" src="/images/reactjs.jpg" width="100%" height={150} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> CS1237 React Development </CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Create dynamic user interfaces with React components and hooks
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1238" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" alt="" src="/images/nodejs.png" width="100%" height={150} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> CS1238 Node.js Backend </CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Develop server-side applications and APIs with Node.js runtime
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1239" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" alt="" src="/images/mongodb.jpg" width="100%" height={150} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> CS1239 MongoDB Database </CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Store and query data using NoSQL database design principles
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/12310" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" alt="" src="/images/expressjs.png" width="100%" height={150} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden"> CS12310 ExpressJS Framework </CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Build RESTful web services and middleware with Express framework
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
