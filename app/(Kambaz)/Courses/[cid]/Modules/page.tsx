/* eslint-disable */
"use client"
import { useParams } from "next/navigation";
import LessonControlButtons from './LessonControlButtons';
import ModulesControls from './ModulesControls';
import ModuleControlButtons from './ModuleControlButtons';
import { FormControl, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { BsGripVertical } from 'react-icons/bs';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useState } from "react";
import { addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";

export default function Modules() {
    const { cid } = useParams();
    const [moduleName, setModuleName] = useState("");
    const { modules } = useSelector((state: RootState) => state.modulesReducer);
    const dispatch = useDispatch();

    return (
        <div>
            <ModulesControls
                setModuleName={setModuleName}
                moduleName={moduleName}
                addModule={() => {
                    dispatch(addModule({ name: moduleName, course: cid }));
                    setModuleName("");
                }}
            />
            <br /><br /><br /><br />
            <ListGroup id="wd-modules" className="rounded-0">
                {modules
                    .filter((module: any) => module.course === cid)
                    .map((module: any) => (
                        <ListGroupItem key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
                                <BsGripVertical className="me-2 fs-3" />
                                {!module.editing && (
                                    <>
                                        <span className="flex-grow-1">{module.name}</span>
                                        <ModuleControlButtons
                                            moduleId={module._id}
                                            deleteModule={(moduleId) => {
                                                dispatch(deleteModule(moduleId));
                                            }}
                                            editModule={(moduleId) => dispatch(editModule(moduleId))}
                                        />
                                    </>
                                )}
                                {module.editing && (
                                    <>
                                        <FormControl
                                            className="me-2"
                                            style={{ maxWidth: "50%" }}
                                            onChange={(e) =>
                                                dispatch(updateModule({ ...module, name: e.target.value }))
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    dispatch(updateModule({ ...module, editing: false }));
                                                } else if (e.key === "Escape") {
                                                    dispatch(updateModule({ ...module, editing: false }));
                                                }
                                            }}
                                            defaultValue={module.name}
                                            autoFocus
                                        />
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => dispatch(updateModule({ ...module, editing: false }))}
                                        >
                                            <FaCheck />
                                        </Button>
                                    </>
                                )}
                            </div>
                            {module.lessons && (
                                <ListGroup className="wd-lessons rounded-0">
                                    {module.lessons.map((lesson: any, index: number) => (
                                        <ListGroupItem key={index} className="wd-lesson p-3 ps-1">
                                            <BsGripVertical className="me-2 fs-3" />
                                            {lesson.name}
                                            <LessonControlButtons />
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroupItem>
                    ))
                }
            </ListGroup>
        </div>
    );
}