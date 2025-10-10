import Link from "next/link";

export default function Assignments() {
    return (
        <div id="wd-assignments">
            <input placeholder="Search for Assignments"
                id="wd-search-assignment" />&nbsp;&nbsp;
            <button id="wd-add-assignment-group">+ Group</button>&nbsp;&nbsp;
            <button id="wd-add-assignment">+ Assignment</button>
            <div>
                <h3 id="wd-assignments-title">
                    ASSIGNMENTS 40% of Total <button>+</button> </h3>
                <ul id="wd-assignment-list">
                    <li className="wd-assignment-list-item">
                        <Link href="/Courses/1234/Assignments/123"
                            className="wd-assignment-link" >
                            A1 - ENV + HTML
                        </Link>
                        <br />
                        Multiple Modules | <b>Not available until</b> May 6 at 12:00am |
                        <br />
                        <b>Due</b> May 13 at 11:59pm | 100pts
                    </li>
                    <li className="wd-assignment-list-item">
                        <Link href="/Courses/1234/Assignments/123"
                            className="wd-assignment-link" >
                            A2 - CSS + BOOTSTRAP
                        </Link>
                        <br />
                        Multiple Modules | <b>Not available until</b> May 13 at 12:00am |
                        <br />
                        <b>Due</b> May 20 at 11:59pm | 100pts
                    </li>
                    <li className="wd-assignment-list-item">
                        <Link href="/Courses/1234/Assignments/123"
                            className="wd-assignment-link" >
                            A3 - JAVASCRIPT + REACT
                        </Link>
                        <br />
                        Multiple Modules | <b>Not available until</b> May 20 at 12:00am |
                        <br />
                        <b>Due</b> May 27 at 11:59pm | 100pts
                    </li>
                </ul>
            </div>
            <div>
                <h3 id="wd-quizzes-title">
                    Quizzes 30% of Total <button>+</button> </h3>
                <ul id="wd-quizzes-list">
                    <li className="wd-quizzes-list-item">
                        <Link href="/Courses/1234/Assignments/123"
                            className="wd-quizzes-link" >
                            Q1 - HTML Quiz
                        </Link>
                        <br />
                        Multiple Attempts | <b>Available until</b> May 6 at 6:00pm |
                        <br />
                        <b>Due</b> May 13 at 11:59pm | 100pts
                    </li>
                    <li className="wd-quizzes-list-item">
                        <Link href="/Courses/1234/Assignments/123"
                            className="wd-quizzes-link" >
                            Q1 - CSS Quiz
                        </Link>
                        <br />
                        Multiple Attempts | <b>Available until</b> May 14 at 6:00pm |
                        <br />
                        <b>Due</b> May 20 at 11:59pm | 100pts
                    </li>
                    <li className="wd-quizzes-list-item">
                        <Link href="/Courses/1234/Assignments/123"
                            className="wd-quizzes-link" >
                            Q1 - Javascript Quiz
                        </Link>
                        <br />
                        Multiple Attempts | <b>Available until</b> May 21 at 6:00pm |
                        <br />
                        <b>Due</b> May 26 at 11:59pm | 100pts
                    </li>
                </ul>
            </div>
            <div>
                <h3 id="wd-quizzes-title">
                    Exams 20% of Total <button>+</button> </h3>
                <ul id="wd-quizzes-list">
                    <li className="wd-quizzes-list-item">
                        <Link href="/Courses/1234/Assignments/123"
                            className="wd-quizzes-link" >
                            Midterm exam
                        </Link>
                        <br />
                        One Attempt | <b>Available until</b> May 6 at 6:00pm |
                        <br />
                        <b>Due</b> May 13 at 11:59pm | 100pts
                    </li>
                    <li className="wd-quizzes-list-item">
                        <Link href="/Courses/1234/Assignments/123"
                            className="wd-quizzes-link" >
                            Final exam
                        </Link>
                        <br />
                        One Attempt | <b>Available until</b> May 6 at 6:00pm |
                        <br />
                        <b>Due</b> May 13 at 11:59pm | 100pts
                    </li>
                </ul>
            </div>
            <div>
                <h3 id="wd-quizzes-title">
                    Project 10% of Total <button>+</button> </h3>
                <ul id="wd-quizzes-list">
                    <li className="wd-quizzes-list-item">
                        <Link href="/Courses/1234/Assignments/123"
                            className="wd-quizzes-link" >
                            Final Project
                        </Link>
                        <br />
                        Multiple Attempts | <b>Available until</b> May 6 at 6:00pm |
                        <br />
                        <b>Due</b> May 13 at 11:59pm | 100pts
                    </li>
                </ul>
            </div>


        </div>
    );
}
