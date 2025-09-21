export default function Modules() {
    return (
        <div>
            <button suppressHydrationWarning={true}>Collapse All</button>&nbsp;&nbsp;
            <button suppressHydrationWarning={true}>View Progress</button>&nbsp;&nbsp;
            <select suppressHydrationWarning={true} id="wd-select-one-view-progress" defaultValue="PUBLISH">
                <option value="PUBLISH">Publish All</option>
            </select>&nbsp;&nbsp;
            <button suppressHydrationWarning={true}>View Progress</button>&nbsp;&nbsp;
            <button > + Module</button>
            <ul id="wd-modules">
                <li className="wd-module">
                    <div className="wd-title">Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Introduction to the course</li>
                                <li className="wd-content-item">Learn what is Web Development</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">Reading</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Full Stack Developer - Chapter 1 - Introduction</li>
                                <li className="wd-content-item">Full Staci Developer - Chapter 2 - Creating User Interfaces with HTML</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">Slides</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Introduction to Web Development</li>
                                <li className="wd-content-item">Creating an HTTP server with Node.js</li>
                                <li className="wd-content-item">Creating a React Application</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className="wd-module">
                    <div className="wd-title">Week 1, Lecture 2 - Formatting User Interfaces with HTML</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Learn how to create user interfaces with HTML</li>
                                <li className="wd-content-item">Deploy the assignment to Vercel</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">Reading</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Full Stack Developer - Chapter 2 - Creating User Interfaces with HTML</li>
                                <li className="wd-content-item">Full Staci Developer - Chapter 3 - HTML Forms</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">Slides</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Introduction to HTML and the DOM</li>
                                <li className="wd-content-item">Formatting Web content with Headings and</li>
                                <li className="wd-content-item">Formatting content with Lists and Tables</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className="wd-module">
                    <div className="wd-title">Week 2 - Cascading Style Sheets</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Learn the fundamentals of CSS</li>
                                <li className="wd-content-item">Understand CSS selectors and specificity</li>
                                <li className="wd-content-item">Create responsive layouts with Flexbox and Grid</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">Reading</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Full Stack Developer - Chapter 3 - Styling with CSS</li>
                                <li className="wd-content-item">Full Stack Developer - Chapter 4 - Responsive Design</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">Slides</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">CSS Fundamentals and Syntax</li>
                                <li className="wd-content-item">Layout with Flexbox and CSS Grid</li>
                                <li className="wd-content-item">Responsive Design Principles</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className="wd-module">
                    <div className="wd-title">Week 3 - JavaScript Fundamentals</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Understand JavaScript data types and variables</li>
                                <li className="wd-content-item">Learn control structures and functions</li>
                                <li className="wd-content-item">Work with DOM manipulation</li>
                            </ul>
                        </li><li className="wd-lesson">
                            <span className="wd-title">Reading</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Full Stack Developer - Chapter 5 - JavaScript Basics</li>
                                <li className="wd-content-item">Full Stack Developer - Chapter 6 - DOM Manipulation</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">Slides</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">JavaScript Variables and Data Types</li>
                                <li className="wd-content-item">Functions and Scope</li>
                                <li className="wd-content-item">Event Handling and DOM APIs</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className="wd-module">
                    <div className="wd-title">Week 4 - React Components and JSX</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Create functional React components</li>
                                <li className="wd-content-item">Understand JSX syntax and expressions</li>
                                <li className="wd-content-item">Manage component props and state</li>
                            </ul>
                            </li>
                        <li className="wd-lesson">
                            <span className="wd-title">Reading</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Full Stack Developer - Chapter 7 - Introduction to React</li>
                                <li className="wd-content-item">Full Stack Developer - Chapter 8 - Component Architecture</li>
                            </ul>
                            </li>
                        <li className="wd-lesson">
                            <span className="wd-title">Slides</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">React Components and JSX</li>
                                <li className="wd-content-item">Props and Component Communication</li>
                                <li className="wd-content-item">State Management with useState Hook</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className="wd-module">
                    <div className="wd-title">Week 5 - State Management and Effects</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Master React hooks (useState, useEffect)</li>
                                <li className="wd-content-item">Handle side effects and API calls</li>
                                <li className="wd-content-item">Implement conditional rendering</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">Reading</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Full Stack Developer - Chapter 9 - React Hooks</li>
                                <li className="wd-content-item">Full Stack Developer - Chapter 10 - Managing Side Effects</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">Slides</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">useEffect Hook and Component Lifecycle</li>
                                <li className="wd-content-item">Fetching Data from APIs</li>
                                <li className="wd-content-item">Conditional Rendering Patterns</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}
