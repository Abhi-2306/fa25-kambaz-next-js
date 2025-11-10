/* eslint-disable */
import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { Button, ListGroupItem } from "react-bootstrap";
export default function TodoItem({ todo }: { todo: any }) {
    const dispatch = useDispatch();
    return (
        <ListGroupItem key={todo.id}>
            <Button onClick={() => dispatch(deleteTodo(todo.id))}>
                Delete
            </Button>
            <Button onClick={() => dispatch(setTodo(todo))}>
                id="{todo.id}" Edit
            </Button>
            {todo.title}
        </ListGroupItem>
    );
}
