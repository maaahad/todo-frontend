import React, { useEffect, useState } from "react";
// react-feather
import { Plus } from "react-feather";

// in-house
import ToDo from "./ToDo";
import { getJSON } from "../../lib/getJSON";
import { credentials } from "../../config";

export const ToDoListForm = ({ toDoList, reFetchToDoLists = (f) => f }) => {
  const addToDo = () => {
    getJSON("post", `${credentials.api.BASE_URL}/todo/${toDoList._id}`, {
      title: "",
      due: null,
      completed: false,
    }).then((toDoList) => {
      reFetchToDoLists();
    });
  };

  const deleteTodo = (toDo) => {
    getJSON(
      "delete",
      `${credentials.api.BASE_URL}/todo/${toDo._id}/${toDoList._id}`
    ).then((toDoList) => {
      reFetchToDoLists();
    });
  };

  if (!toDoList) return null;
  return (
    <div>
      <div>
        <div>
          <h6>{toDoList.title}</h6>
          {toDoList.completed && <span>Completed</span>}
        </div>
        <div>Saving.../saved/</div>
      </div>
      <form>
        {toDoList.todos.map((toDo, index) => (
          <ToDo
            key={toDo._id}
            toDo={toDo}
            onDeleteToDo={deleteTodo}
            reFetchToDoLists={reFetchToDoLists}
          />
        ))}

        <button type="button" onClick={addToDo}>
          Add Todo <Plus />
        </button>
      </form>
    </div>
  );
};
