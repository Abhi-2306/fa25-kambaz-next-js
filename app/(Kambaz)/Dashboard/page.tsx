import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
            <div id="wd-dashboard-courses">
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1234" className="wd-dashboard-course-link">
                        <Image alt="" src="/images/html.jpg" width={200} height={150} />
                        <div>
                            <h5> CS1234 HTML Fundamentals </h5>
                            <p className="wd-dashboard-course-title">
                                Learn the building blocks of web pages with HTML structure and semantics
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <br />
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1235" className="wd-dashboard-course-link">
                        <Image alt="" src="/images/css.png" width={200} height={150} />
                        <div>
                            <h5> CS1235 CSS Styling </h5>
                            <p className="wd-dashboard-course-title">
                                Master visual design with CSS layouts, animations, and responsive design
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <br />
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1236" className="wd-dashboard-course-link">
                        <Image alt="" src="/images/javascript.avif" width={200} height={150} />
                        <div>
                            <h5> CS1236 JavaScript Programming </h5>
                            <p className="wd-dashboard-course-title">
                                Build interactive web applications with modern JavaScript ES6+
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <br />
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1237" className="wd-dashboard-course-link">
                        <Image alt="" src="/images/reactjs.jpg" width={200} height={150} />
                        <div>
                            <h5> CS1237 React Development </h5>
                            <p className="wd-dashboard-course-title">
                                Create dynamic user interfaces with React components and hooks
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <br />
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1238" className="wd-dashboard-course-link">
                        <Image alt="" src="/images/nodejs.png" width={200} height={150} />
                        <div>
                            <h5> CS1238 Node.js Backend  </h5>
                            <p className="wd-dashboard-course-title">
                                Develop server-side applications and APIs with Node.js runtime
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <br />
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1239" className="wd-dashboard-course-link">
                        <Image alt="" src="/images/mongodb.jpg" width={200} height={150} />
                        <div>
                            <h5> CS1239 MongoDB Database </h5>
                            <p className="wd-dashboard-course-title">
                                Store and query data using NoSQL database design principles
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <br />
                <div className="wd-dashboard-course">
                    <Link href="/Courses/12310" className="wd-dashboard-course-link">
                        <Image alt="" src="/images/expressjs.png" width={200} height={150} />
                        <div>
                            <h5> CS12310 ExpressJS Framework </h5>
                            <p className="wd-dashboard-course-title">
                                Build RESTful web services and middleware with Express framework
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
