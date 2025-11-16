"use client";
import { useState } from "react";
import { FormControl, Form } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithArrays() {
    const API = `${HTTP_SERVER}/lab5/todos`;
    const [todoId, setTodoId] = useState("1");
    const [removeId, setRemoveId] = useState("1");
    const [updateId, setUpdateId] = useState("1");
    const [updateTitle, setUpdateTitle] = useState("NodeJS Assignment");
    const [completedId, setCompletedId] = useState("1");
    const [completedStatus, setCompletedStatus] = useState(false);
    const [descriptionId, setDescriptionId] = useState("1");
    const [description, setDescription] = useState("Create a NodeJS server with ExpressJS");

    return (
        <div id="wd-working-with-arrays">
            <h3>Working with Arrays</h3>
            <h4>Retrieving Arrays</h4>
            <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
                Get Todos </a><hr />
            <h4>Retrieving an Item from an Array by ID</h4>
            <a id="wd-retrieve-todo-by-id" className="btn btn-primary float-end" href={`${API}/${todoId}`}>
                Get Todo by ID
            </a>
            <FormControl id="wd-todo-id" defaultValue={todoId} className="w-50"
                onChange={(e) => setTodoId(e.target.value)} />
            <hr />
            <h3>Filtering Array Items</h3>
            <a id="wd-retrieve-completed-todos" className="btn btn-primary"
                href={`${API}?completed=true`}>
                Get Completed Todos
            </a><hr />
            <h3>Creating new Items in an Array</h3>
            <a id="wd-create-todo" className="btn btn-primary"
                href={`${API}/create`}>
                Create Todo
            </a><hr />
            <h3>Removing from an Array</h3>
            <FormControl id="wd-todo-id-remove" defaultValue={removeId} className="w-50"
                onChange={(e) => setRemoveId(e.target.value)} /><hr />
            <a id="wd-remove-todo" className="btn btn-primary float-end"
                href={`${API}/${removeId}/delete`}
                target="_blank">
                Remove Todo with ID = {removeId}
            </a>
            <h3>Updating an Item in an Array</h3>
            <a href={`${API}/${updateId}/title/${encodeURIComponent(updateTitle)}`} className="btn btn-primary float-end">
                Update Todo</a>
            <FormControl id="wd-todo-id-update" defaultValue={updateId} className="w-25 float-start me-2"
                onChange={(e) => setUpdateId(e.target.value)} />
            <FormControl id="wd-todo-title-update" defaultValue={updateTitle} className="w-50 float-start"
                onChange={(e) => setUpdateTitle(e.target.value)} />
            <br /><br /><hr />

            <h3>Update Completed Status</h3>
            <a href={`${API}/${completedId}/completed/${completedStatus}`} className="btn btn-primary float-end">
                Complete Todo ID = {completedId}</a>
            <FormControl id="wd-todo-id-completed" defaultValue={completedId} className="w-25 float-start me-2"
                onChange={(e) => setCompletedId(e.target.value)} />
            <Form.Check
                type="checkbox"
                id="wd-todo-completed-checkbox"
                checked={completedStatus}
                onChange={(e) => setCompletedStatus(e.target.checked)}
                className="float-start"
            />
            <br /><br /><hr />

            <h3>Update Description</h3>
            <a href={`${API}/${descriptionId}/description/${encodeURIComponent(description)}`} className="btn btn-primary float-end">
                Describe Todo ID = {descriptionId}</a>
            <FormControl id="wd-todo-id-description" defaultValue={descriptionId} className="w-25 float-start me-2"
                onChange={(e) => setDescriptionId(e.target.value)} />
            <FormControl id="wd-todo-description-update" defaultValue={description} className="w-50 float-start"
                onChange={(e) => setDescription(e.target.value)} />
            <br /><br /> <br /><hr />
        </div>
    );
}