/* eslint-disable */
"use client"
import { useParams, useRouter } from "next/navigation";
import LessonControlButtons from './LessonControlButtons';
import ModulesControls from './ModulesControls';
import ModuleControlButtons from './ModuleControlButtons';
import { FormControl, ListGroup, ListGroupItem, Button, Collapse } from 'react-bootstrap';
import { BsGripVertical } from 'react-icons/bs';
import { FaCheck, FaTimes, FaCaretDown, FaCaretRight } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { addModule, editModule, updateModule, deleteModule, setModules } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import * as client from "../../client";

export default function Modules() {
    const { cid } = useParams<{ cid: string }>();
    const router = useRouter();
    const [moduleName, setModuleName] = useState("");
    const { modules } = useSelector((state: RootState) => state.modulesReducer);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const dispatch = useDispatch();

    const onUpdateModule = async (module: any) => {
        await client.updateModule(cid, module);
        const newModules = modules.map((m: any) => m._id === module._id ? module : m);
        dispatch(setModules(newModules));
    };

    const onRemoveModule = async (moduleId: string) => {
        await client.deleteModule(cid, moduleId);
        dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
    };

    const onCreateModuleForCourse = async () => {
        if (!cid) return;
        const newModule = { name: moduleName, course: cid };
        const module = await client.createModuleForCourse(cid, newModule);
        dispatch(setModules([...modules, module]));
        setModuleName("");
    };

    const fetchModules = async () => {
        try {
            const modules = await client.findModulesForCourse(cid as string);
            dispatch(setModules(modules));
        } catch (error) {
            console.error("Error fetching modules:", error);
        }
    };

    useEffect(() => {

        if (!currentUser) {
            router.push("/Account/Signin");
            return;
        }

        fetchModules();
    }, [cid, currentUser]);

    const isFaculty = currentUser?.role === "FACULTY";

    const [expandedModules, setExpandedModules] = useState<Set<string>>(
        new Set(modules.map((m: any) => m._id))
    );

    const toggleModule = (moduleId: string) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(moduleId)) {
            newExpanded.delete(moduleId);
        } else {
            newExpanded.add(moduleId);
        }
        setExpandedModules(newExpanded);
    };

    return (
        <div>
            <ModulesControls
                setModuleName={setModuleName}
                moduleName={moduleName}
                addModule={onCreateModuleForCourse}
                isFaculty={isFaculty}
            />
            <br /><br /><br /><br />
            <ListGroup id="wd-modules" className="rounded-0">
                {modules.length === 0 ? (
                    <ListGroupItem className="text-center p-5">
                        <p className="text-muted mb-0">
                            {isFaculty ? "No modules yet. Create your first module above." : "No modules available yet."}
                        </p>
                    </ListGroupItem>
                ) : (
                    modules.map((module: any) => {
                        const isExpanded = expandedModules.has(module._id);
                        return (
                            <ListGroupItem key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
                                <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
                                    <BsGripVertical className="me-2 fs-3" />
                                    {!module.editing && (
                                        <>
                                            <button
                                                className="btn btn-link p-0 me-2 text-dark"
                                                onClick={() => toggleModule(module._id)}
                                                aria-expanded={isExpanded}
                                            >
                                                {isExpanded ? <FaCaretDown /> : <FaCaretRight />}
                                            </button>
                                            <span
                                                className="flex-grow-1"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => toggleModule(module._id)}
                                            >
                                                {module.name}
                                            </span>
                                            {isFaculty && (
                                                <ModuleControlButtons
                                                    moduleId={module._id}
                                                    deleteModule={(moduleId) => onRemoveModule(moduleId)}
                                                    editModule={(moduleId) => dispatch(editModule(moduleId))}
                                                />
                                            )}
                                        </>
                                    )}
                                    {module.editing && isFaculty && (
                                        <>
                                            <FormControl
                                                className="me-2"
                                                style={{ maxWidth: "50%" }}
                                                onChange={(e) =>
                                                    dispatch(updateModule({ ...module, name: e.target.value }))
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        onUpdateModule({ ...module, editing: false });
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
                                                onClick={() => onUpdateModule({ ...module, editing: false })}
                                            >
                                                <FaCheck />
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <Collapse in={isExpanded}>
                                    <div>
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
                                    </div>
                                </Collapse>
                            </ListGroupItem>
                        );
                    })
                )}
            </ListGroup>
        </div>
    );
}