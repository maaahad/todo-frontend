import React, { Fragment, useState, useEffect, useRef } from "react";
import {
  Trash2,
  Plus,
  FileText,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowDown,
  ArrowUp,
} from "react-feather";
import { ToDoListForm } from "./ToDoListForm";

import { getJSON } from "../../lib/getJSON";
import { credentials } from "../../config";
import { useAutoSave, SAVING_STATE } from "../../lib/hooks";

import styles from "../../styles/features/todo/ToDoLists.module.sass";

export const ToDoLists = () => {
  const [toDoLists, setToDoLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [displayDropdown, setDisplayDropdown] = useState(false);
  const [savingState, setSavingState] = useState("");
  const savingStateTimer = useRef();

  // need to update this to match todolist
  // const [savingState, _toDo, error, save] = useAutoSave(toDo);

  const onChangeSaved = (savingState) => {
    if (savingStateTimer.current) clearTimeout(savingStateTimer.current);
    setSavingState(savingState);
    savingStateTimer.current = setTimeout(() => setSavingState(""), 2000);
  };

  const onTitleChange = (event) => {
    // || ToDO: implement backend to update todolist title
    // save("put", `${credentials.api.BASE_URL}/todo/${_toDo._id}`, {
    //   title: event.target.value,
    //   due: _toDo.due,
    //   completed: _toDo.completed,
    // });
    console.log("On TodoList title change");
  };

  const onDisplayDropdown = (id) => {
    if (!displayDropdown) {
      setDisplayDropdown(true);
      setActiveListId(id);
    } else {
      if (id === activeListId) {
        setDisplayDropdown(false);
        setActiveListId(null);
      } else {
        setActiveListId(id);
      }
    }
  };

  const fetchToDoLists = () => {
    getJSON("get", `${credentials.api.BASE_URL}/todo-lists`).then(
      (toDoLists) => {
        setToDoLists(toDoLists);
      }
    );
  };

  const addTodoList = () => {
    getJSON("post", `${credentials.api.BASE_URL}/add/todo-list`, {
      title: "New TodoList",
      todos: [],
    }).then((todoList) =>
      setToDoLists((todoLists) => [...todoLists, todoList])
    );
  };

  const deleteTodoList = (todoListId) => {
    // || TODO: deleting todolist should delete all associated todo as well
    getJSON(
      "delete",
      `${credentials.api.BASE_URL}/delete/todo-list/${todoListId}`
    ).then((todoList) =>
      setToDoLists((todoLists) =>
        todoLists.filter((tdl) => tdl._id !== todoList._id)
      )
    );
  };

  useEffect(() => {
    fetchToDoLists();
  }, []);

  if (!toDoLists.length) return null;
  return (
    <div className={styles.contentContainer}>
      <div className={styles.todoLists}>
        <h2>My ToDo Lists</h2>
        {toDoLists.map((todolist) => (
          <div key={todolist._id} className={styles.todoListContainer}>
            <div className={styles.todoList}>
              <div
                className={styles.todoListMeta}
                style={
                  displayDropdown && activeListId === todolist._id
                    ? { backgroundColor: "#f5f1f1" }
                    : {}
                }
              >
                <div>
                  <FileText />
                  {/* <span>{todolist.title}</span> */}
                  <input
                    type="text"
                    label="What to do?"
                    value={todolist.title}
                    onChange={onTitleChange}
                  />
                  {todolist.todos.length ? (
                    todolist.todos.every((todo) => todo.completed) ? (
                      <span className={styles.chip}>Completed</span>
                    ) : null
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => onDisplayDropdown(todolist._id)}
                  style={
                    displayDropdown && activeListId === todolist._id
                      ? { backgroundColor: "#03dac6", color: "#ffffff" }
                      : {}
                  }
                >
                  {displayDropdown && activeListId === todolist._id ? (
                    <ArrowUp />
                  ) : (
                    <ArrowDown />
                  )}
                </button>
              </div>
              <button
                type="button"
                className={styles.deleteTodoListButton}
                title="delete"
                onClick={() => deleteTodoList(todolist._id)}
              >
                <Trash2 />
              </button>
            </div>
            {/* This is styled in it's own component */}
            {displayDropdown && activeListId === todolist._id ? (
              <ToDoListForm
                key={activeListId} // use key to make React recreate component to reset internal state
                toDoList={toDoLists.find(
                  (todoList) => todoList._id === activeListId
                )}
                reFetchToDoLists={fetchToDoLists}
                onChangeSaved={onChangeSaved}
              />
            ) : null}
          </div>
        ))}
        <button
          type="button"
          className={styles.addTodoListButton}
          onClick={addTodoList}
        >
          Add ToDoList
          <Plus />
        </button>
      </div>

      <span className={styles.savingState}>{savingState}</span>
      {/* {activeListId && (
        <ToDoListForm
          key={activeListId} // use key to make React recreate component to reset internal state
          toDoList={toDoLists.find((todoList) => todoList._id === activeListId)}
          reFetchToDoLists={fetchToDoLists}
        />
      )} */}
    </div>
  );
};
