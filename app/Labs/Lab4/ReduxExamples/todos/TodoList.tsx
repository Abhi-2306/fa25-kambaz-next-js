/* eslint-disable */
import React from "react";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ListGroup } from "react-bootstrap";

export default function TodoList() {
    const { todos } = useSelector((state: RootState) => state.todosReducer);

    return (
        <div id="wd-todo-list-redux" className="container mt-4">
            <h2 className="mb-3">Todo List</h2>
            <ListGroup>
                <TodoForm />
                {todos.map((todo: any) => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ListGroup>
            <hr className="mt-4" />
        </div>
    );
}