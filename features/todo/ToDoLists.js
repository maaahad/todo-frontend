import React, { Fragment, useState, useEffect } from "react";
import { Trash, Plus, FileText } from "react-feather";
import { ToDoListForm } from "./ToDoListForm";

import { getJSON } from "../../lib/getJSON";
import { credentials } from "../../config";

import styles from "../../styles/features/todo/ToDoLists.module.sass";

export const ToDoLists = () => {
  const [toDoLists, setToDoLists] = useState([]);
  const [activeListId, setActiveListId] = useState();

  const reFetchToDoLists = () => {
    getJSON("get", `${credentials.api.BASE_URL}/todo-lists`).then(
      (toDoLists) => {
        setToDoLists(toDoLists);
      }
    );
  };

  useEffect(() => {
    reFetchToDoLists();
  }, []);

  if (!toDoLists.length) return null;
  return (
    <div className={styles.contentContainer}>
      <div className={styles.todoLists}>
        <h2>My ToDo Lists</h2>
        {toDoLists.map((todolist) => (
          <div key={todolist._id} className={styles.todoList}>
            <button
              className={styles.todoListMeta}
              onClick={() => setActiveListId(todolist._id)}
            >
              <FileText /> <span>{todolist.title}</span>
              {todolist.todos.every((todo) => todo.completed) && (
                <span className={styles.chip}>Completed</span>
              )}
            </button>
            <button
              type="button"
              className={styles.deleteTodoListButton}
              title="delete"
            >
              <Trash />
            </button>
          </div>
        ))}
        <button type="button" className={styles.addTodoListButton}>
          Add ToDoList
          <Plus />
        </button>
      </div>

      {activeListId && (
        <ToDoListForm
          key={activeListId} // use key to make React recreate component to reset internal state
          toDoList={toDoLists.find((todoList) => todoList._id === activeListId)}
          reFetchToDoLists={reFetchToDoLists}
        />
      )}
    </div>
  );
};
