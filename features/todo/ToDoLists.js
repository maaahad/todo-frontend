import React, { Fragment, useState, useEffect } from "react";
import { Trash2, Plus, FileText, ArrowDownCircle, ArrowUpCircle } from "react-feather";
import { ToDoListForm } from "./ToDoListForm";

import { getJSON } from "../../lib/getJSON";
import { credentials } from "../../config";
import { useAutoSave, SAVING_STATE } from "../../lib/hooks";


import styles from "../../styles/features/todo/ToDoLists.module.sass";

export const ToDoLists = () => {
  const [toDoLists, setToDoLists] = useState([]);
  const [activeListId, setActiveListId] = useState();

  const fetchToDoLists = () => {
    getJSON("get", `${credentials.api.BASE_URL}/todo-lists`).then(
      (toDoLists) => {
        setToDoLists(toDoLists);
      }
    );
  };

  const addTodoList = () => {
    getJSON("post", `${credentials.api.BASE_URL}/add/todo-list`, {title: "New TodoList", todos: []})
      .then(todoList => setToDoLists(todoLists => [...todoLists, todoList]));
  }

  const deleteTodoList = (todoListId) => {
    // || TODO: deleting todolist should delete all associated todo as well
    getJSON("delete", `${credentials.api.BASE_URL}/delete/todo-list/${todoListId}`)
      .then(todoList => setToDoLists(todoLists => todoLists.filter(tdl => tdl._id !== todoList._id)));
  }

  useEffect(() => {
    fetchToDoLists();
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
              <div>
                <FileText /> 
                <span>{todolist.title}</span>
                {/* <input 
                  type="text"
                  value={todolist.title}
                  onChange={() => console.log("I am here....")}
                /> */}
              </div>

              {todolist.todos.length ? todolist.todos.every((todo) => todo.completed) ? (
                <span className={styles.chip}>Completed</span>
              ): null : null}
            </button>
            <button
              type="button"
              className={styles.deleteTodoListButton}
              title="delete"
              onClick={() => deleteTodoList(todolist._id)}
            >
              <Trash2 />
            </button>
          </div>
        ))}
        <button type="button" className={styles.addTodoListButton} onClick={addTodoList}>
          Add ToDoList
          <Plus />
        </button>
      </div>

      {activeListId && (
        <ToDoListForm
          key={activeListId} // use key to make React recreate component to reset internal state
          toDoList={toDoLists.find((todoList) => todoList._id === activeListId)}
          reFetchToDoLists={fetchToDoLists}
        />
      )}
    </div>
  );
};
