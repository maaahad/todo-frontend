import React, { useState, useRef } from "react";
import { Plus, FileMinus } from "react-feather";
import ToDo from "./ToDo";
import { getJSON } from "../../lib/getJSON";
import { credentials } from "../../config";

import styles from "../../styles/features/todo/ToDoListForm.module.sass";

export const ToDoListForm = ({
  toDoList,
  reFetchToDoLists = (f) => f,
  onSavingStateChanged = (f) => f,
}) => {
  const addToDo = () => {
    getJSON("post", `${credentials.api.BASE_URL}/todo/${toDoList._id}`, {
      title: "",
      due: "",
      completed: false,
    }).then(() => {
      reFetchToDoLists();
    });
  };

  const deleteTodo = (toDo) => {
    getJSON(
      "delete",
      `${credentials.api.BASE_URL}/todo/${toDo._id}/${toDoList._id}`
    ).then(() => {
      reFetchToDoLists();
    });
  };

  if (!toDoList) return null;
  return (
    <div className={styles.todoListContainer}>
      {/* <div className={styles.todoListHeader}>
        <div className={styles.todoListTitle}>
          <h6>{toDoList.title}</h6>
        </div>
        <button>
          Delete All <FileMinus />
        </button>
      </div> */}
      <form className={styles.formContainer}>
        {toDoList.todos.map((toDo) => (
          <ToDo
            key={toDo._id}
            toDo={toDo}
            onDeleteToDo={deleteTodo}
            reFetchToDoLists={reFetchToDoLists}
            onSavingStateChanged={onSavingStateChanged}
          />
        ))}

        <button
          type="button"
          onClick={addToDo}
          title="Add ToDo"
          className={styles.addToDoButton}
        >
          Add Todo <Plus />
        </button>
      </form>
    </div>
  );
};
