/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import * as client from "./client";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaTrash } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaPencil } from "react-icons/fa6";

export default function WorkingWithArraysAsynchronously() {
    const [todos, setTodos] = useState<any[]>([]);
    const [editingTodo, setEditingTodo] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchTodos = async () => {
        try {
            const todos = await client.fetchTodos();
            setTodos(todos);
            setErrorMessage(null);
        } catch (error: any) {
            setErrorMessage("Failed to fetch todos");
        }
    };

    const removeTodo = async (todo: any) => {
        try {
            const updatedTodos = await client.removeTodo(todo);
            setTodos(updatedTodos);
            setErrorMessage(null);
        } catch (error: any) {
            console.log("Remove todo error:", error);
            setErrorMessage(error.response?.data?.message || `Unable to remove Todo with ID ${todo.id}`);
        }
    };

    const createNewTodo = async () => {
        try {
            const todos = await client.createNewTodo();
            setTodos(todos);
            setErrorMessage(null);
        } catch (error: any) {
            setErrorMessage("Failed to create new todo");
        }
    };

    const postNewTodo = async () => {
        try {
            const newTodo = await client.postNewTodo({
                title: "New Posted Todo",
                completed: false
            });
            setTodos([...todos, newTodo]);
            setErrorMessage(null);
        } catch (error: any) {
            setErrorMessage("Failed to post new todo");
        }
    };

    const deleteTodo = async (todo: any) => {
        try {
            await client.deleteTodo(todo);
            const newTodos = todos.filter((t) => t.id !== todo.id);
            setTodos(newTodos);
            setErrorMessage(null);
        } catch (error: any) {
            console.log("Delete todo error:", error);
            setErrorMessage(error.response?.data?.message || `Unable to delete Todo with ID ${todo.id}`);
        }
    };

    const editTodo = (todo: any) => {
        setEditingTodo({ ...todo });
        setErrorMessage(null);
    };

    const updateTodo = async (todo: any) => {
        try {
            await client.updateTodo(todo);
            setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
            setEditingTodo(null);
            setErrorMessage(null);
        } catch (error: any) {
            console.log("Update todo error:", error);
            setErrorMessage(error.response?.data?.message || `Unable to update Todo with ID ${todo.id}`);
        }
    };

    const handleInputChange = (todo: any, field: string, value: any) => {
        const updatedTodo = { ...todo, [field]: value };
        setEditingTodo(updatedTodo);
    };

    const handleKeyDown = (e: React.KeyboardEvent, todo: any) => {
        if (e.key === "Enter") {
            updateTodo(todo);
        }
        if (e.key === "Escape") {
            setEditingTodo(null);
            setErrorMessage(null);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div id="wd-asynchronous-arrays">
            <h3>Working with Arrays Asynchronously</h3>
            {errorMessage && (
                <div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2 alert-dismissible">
                    {errorMessage}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setErrorMessage(null)}
                        aria-label="Close"
                    ></button>
                </div>
            )}

            <h4>
                Todos
                <FaPlusCircle
                    onClick={createNewTodo}
                    className="text-success float-end fs-3"
                    style={{ cursor: 'pointer' }}
                    title="Create Todo (GET)"
                />
                <FaPlusCircle
                    onClick={postNewTodo}
                    className="text-primary float-end fs-3 me-3"
                    id="wd-post-todo"
                    style={{ cursor: 'pointer' }}
                    title="Post New Todo (POST)"
                />
            </h4>
            <ListGroup>
                {todos.map((todo) => (
                    <ListGroupItem key={todo.id} className="d-flex align-items-center">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            className="form-check-input me-2"
                            onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })}
                        />

                        {editingTodo?.id === todo.id ? (
                            <FormControl
                                className="me-2 flex-grow-1"
                                value={editingTodo.title}
                                onKeyDown={(e) => handleKeyDown(e, editingTodo)}
                                onChange={(e) => handleInputChange(editingTodo, 'title', e.target.value)}
                                onBlur={() => {
                                    updateTodo(editingTodo);
                                    setEditingTodo(null);
                                }}
                                autoFocus
                            />
                        ) : (
                            <span
                                className="flex-grow-1"
                                style={{
                                    textDecoration: todo.completed ? "line-through" : "none",
                                    cursor: 'pointer'
                                }}
                                onClick={() => editTodo(todo)}
                            >
                                {todo.title}
                            </span>
                        )}

                        <div className="ms-auto d-flex">
                            <FaPencil
                                onClick={() => editTodo(todo)}
                                className="text-primary me-2"
                                style={{ cursor: 'pointer' }}
                                title="Edit"
                            />
                            <FaTrash
                                onClick={() => removeTodo(todo)}
                                className="text-danger me-2"
                                id="wd-remove-todo"
                                style={{ cursor: 'pointer' }}
                                title="Remove (GET)"
                            />
                            <TiDelete
                                onClick={() => deleteTodo(todo)}
                                className="text-danger fs-4"
                                id="wd-delete-todo"
                                style={{ cursor: 'pointer' }}
                                title="Delete (DELETE)"
                            />
                        </div>
                    </ListGroupItem>
                ))}
            </ListGroup>
            <hr />
        </div>
    );
}