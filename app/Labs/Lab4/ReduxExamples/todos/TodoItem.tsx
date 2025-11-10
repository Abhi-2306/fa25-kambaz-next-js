/* eslint-disable */
import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { Button, ListGroupItem } from "react-bootstrap";

export default function TodoItem({ todo }: { todo: any }) {
    const dispatch = useDispatch();

    return (
        <ListGroupItem key={todo.id} className="d-flex align-items-center p-3">
            <div className="d-flex gap-2 me-3">
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => dispatch(deleteTodo(todo.id))}
                >
                    Delete
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => dispatch(setTodo(todo))}
                >
                    Edit
                </Button>
            </div>
            <span className="flex-grow-1">{todo.title}</span>
            <small className="text-muted">id: {todo.id}</small>
        </ListGroupItem>
    );
}