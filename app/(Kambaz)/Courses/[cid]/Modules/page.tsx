import LessonControlButtons from './LessonControlButtons';
import ModulesControls from './ModulesControls';
import ModuleControlButtons from './ModuleControlButtons';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { BsGripVertical } from 'react-icons/bs';

export default function Modules() {
    return (
        <div>
            <ModulesControls />
            <br /><br /><br /><br />

            <ListGroup className="rounded-0" id="wd-modules">
                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className=" fs-3" />  Week 1 <ModuleControlButtons />
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3 pe-1" />  Introduction to the course <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Learn what is Web Development <LessonControlButtons />
                        </ListGroupItem>

                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />READING <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> Full Stack Developer - Chapter 1 <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> Full Stack Developer - Chapter 2 <LessonControlButtons />
                        </ListGroupItem>

                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />SLIDES <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Introduction to Web Development <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Creating an HTTP server with Node.js <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> Creating a React Application <LessonControlButtons />
                        </ListGroupItem>
                    </ListGroup>
                </ListGroupItem>

                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" />  Week 2 - Cascading Style Sheets <ModuleControlButtons />
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />LEARNING OBJECTIVES <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> Learn the fundamentals of CSS <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Understand CSS selectors and specificity <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Create responsive layouts with Flexbox and Grid <LessonControlButtons />
                        </ListGroupItem>

                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />READING <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Full Stack Developer - Chapter 3 - Styling with CSS <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> Full Stack Developer - Chapter 4 - Responsive Design <LessonControlButtons />
                        </ListGroupItem>

                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />SLIDES <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> CSS Fundamentals and Syntax <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> Layout with Flexbox and CSS Grid <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Responsive Design Principles <LessonControlButtons />
                        </ListGroupItem>
                    </ListGroup>
                </ListGroupItem>

                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" /> Week 3 - JavaScript Fundamentals <ModuleControlButtons />
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />LEARNING OBJECTIVES <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> Understand JavaScript data types and variables <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> Learn control structures and functions <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Work with DOM manipulation <LessonControlButtons />
                        </ListGroupItem>

                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />READING <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Full Stack Developer - Chapter 5 - JavaScript Basics <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> Full Stack Developer - Chapter 6 - DOM Manipulation <LessonControlButtons />
                        </ListGroupItem>

                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />SLIDES <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  JavaScript Variables and Data Types <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> Functions and Scope <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Event Handling and DOM APIs <LessonControlButtons />
                        </ListGroupItem>
                    </ListGroup>
                </ListGroupItem>

                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" />   Week 4 - React Components and JSX <ModuleControlButtons />
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />LEARNING OBJECTIVES <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Create functional React components <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Understand JSX syntax and expressions <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> Manage component props and state <LessonControlButtons />
                        </ListGroupItem>

                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />READING <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Full Stack Developer - Chapter 7 - Introduction to React <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> Full Stack Developer - Chapter 8 - Component Architecture <LessonControlButtons />
                        </ListGroupItem>

                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />SLIDES <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> React Components and JSX <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Props and Component Communication <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  State Management with useState Hook <LessonControlButtons />
                        </ListGroupItem>
                    </ListGroup>
                </ListGroupItem>

                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" />   Week 5 - State Management and Effects <ModuleControlButtons />
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />LEARNING OBJECTIVES <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Master React hooks (useState, useEffect) <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Handle side effects and API calls <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Implement conditional rendering <LessonControlButtons />
                        </ListGroupItem>

                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />READING <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Full Stack Developer - Chapter 9 - React Hooks <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Full Stack Developer - Chapter 10 - Managing Side Effects <LessonControlButtons />
                        </ListGroupItem>

                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />SLIDES <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" /> useEffect Hook and Component Lifecycle <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Fetching Data from APIs <LessonControlButtons />
                        </ListGroupItem>
                        <ListGroupItem className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />  Conditional Rendering Patterns <LessonControlButtons />
                        </ListGroupItem>
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div>
    );
}