import React, { useEffect, useReducer } from "react";
import { Trash2 } from "react-feather";
import { parseISO, formatDistanceToNow } from "date-fns";
import { CheckSquare } from "react-feather";
import { useAutoSave, SAVING_STATE } from "../../lib/hooks";
import { credentials } from "../../config";
import styles from "../../styles/features/todo/ToDo.module.sass";

// This method compute the duration to due date relative to NOW
// And decide whether this toDo is overdued / completed or
// return the remaining time to finish
function getTodosDueStatus(dueDate) {
  let status = "";
  try {
    if (dueDate) {
      const today = new Date();
      if (today > dueDate) status = "overdue";
      else {
        const date = parseISO(dueDate.toISOString());
        const timeDuration = formatDistanceToNow(date);
        status = `${timeDuration} remaining`;
      }
    }
  } catch (error) {
    status = "no deadline";
  }

  return status;
}

export default function ToDo({
  toDo,
  onDeleteToDo = (f) => f,
  reFetchToDoLists = (f) => f,
  onSavingStateChanged = (f) => f,
}) {
  const [_toDo, setTodo] = useReducer(
    (_toDo, newToDo) => ({ ..._toDo, ...newToDo }),
    toDo
  );
  const [error, save] = useAutoSave(setTodo, onSavingStateChanged);

  const onTitleChange = (event) => {
    save("put", `${credentials.api.BASE_URL}/todo/${_toDo._id}`, {
      title: event.target.value,
      due: _toDo.due,
      completed: _toDo.completed,
    });
  };

  const onCompletionCheck = (event) => {
    // In this case we need to trigger a method to propagate completion state in ToDoLists
    save(
      "put",
      `${credentials.api.BASE_URL}/todo/${_toDo._id}`,
      {
        title: _toDo.title,
        due: _toDo.due,
        completed: event.target.checked,
      },
      reFetchToDoLists
    );
  };

  const onDueDateChange = (event) => {
    save("put", `${credentials.api.BASE_URL}/todo/${_toDo._id}`, {
      title: _toDo.title,
      due: event.target.value,
      completed: _toDo.completed,
    });
  };

  if (error) return <h6>{error.message}</h6>;
  if (!_toDo) return null;
  return (
    <div className={styles.todoContainer}>
      <div className={styles.todoFormContainer}>
        <div className={styles.todoFormInputOutput}>
          <div className={styles.todoFormInput}>
            <input
              type="checkbox"
              checked={_toDo.completed}
              onChange={onCompletionCheck}
            />
            <input
              type="text"
              label="What to do?"
              value={_toDo.title}
              onChange={onTitleChange}
              disabled={_toDo.completed}
            />
            {/* This date field have an issue on change */}
            <input
              type="date"
              value={_toDo.due ? _toDo.due.split("T")[0] : ""}
              onChange={onDueDateChange}
            />
          </div>

          {/* Color based on due status */}
          <p>
            {_toDo.completed
              ? "completed"
              : _toDo.due
              ? getTodosDueStatus(new Date(_toDo.due))
              : "no deadline"}
          </p>
        </div>
        <button type="button" onClick={() => onDeleteToDo(_toDo)}>
          <Trash2 />
        </button>
      </div>
    </div>
  );
}
