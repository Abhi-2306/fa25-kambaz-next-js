import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import StopSign from "./StopSign";
import { useState } from "react";
import ModuleEditor from "./ModuleEditor";

export default function ModulesControls({
    moduleName,
    setModuleName,
    addModule,
    onCollapseAll
}: {
    moduleName: string;
    setModuleName: (title: string) => void;
    addModule: () => void;
    onCollapseAll?: () => void;
}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div id="wd-modules-controls" className="text-nowrap d-flex justify-content-end">
            <Button
                variant="secondary"
                size="lg"
                className="me-1"
                id="wd-collapse-all"
                onClick={onCollapseAll}
            >
                Collapse All
            </Button>
            <Button variant="secondary" size="lg" className="me-1" id="wd-view-progress">
                View Progress
            </Button>
            <Dropdown className="me-2">
                <DropdownToggle variant="secondary" size="lg" id="wd-publish-all-btn">
                    <GreenCheckmark /> Publish All
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem id="wd-publish-all-modules-and-items">
                        <GreenCheckmark /> Publish all modules and items
                    </DropdownItem>
                    <DropdownItem id="wd-publish-modules-only">
                        <GreenCheckmark /> Publish modules only
                    </DropdownItem>
                    <DropdownItem id="wd-unpublish-all-modules-and-items">
                        <StopSign /> Unpublish all modules and items
                    </DropdownItem>
                    <DropdownItem id="wd-unpublish-modules-only">
                        <StopSign /> Unpublish modules only
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Button variant="danger" size="lg" className="me-1" id="wd-add-module-btn" onClick={handleShow}>
                <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                Module
            </Button>
            <ModuleEditor
                show={show}
                handleClose={handleClose}
                dialogTitle="Add Module"
                moduleName={moduleName}
                setModuleName={setModuleName}
                addModule={addModule}
            />
        </div>
    );
}
