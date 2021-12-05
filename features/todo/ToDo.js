import React from "react";
// date-fns for date formatting
import { parseISO, formatDistanceToNow } from "date-fns";

// react-feather
import { CheckSquare } from "react-feather";

// in-house
import { useAutoSave, SAVING_STATE } from "../../lib/hooks";
import { credentials } from "../../config";

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
}) {
  const [savingState, _toDo, error, save] = useAutoSave(toDo);

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

  const onDueDateChange = (newDate) => {
    save("put", `${credentials.api.BASE_URL}/todo/${_toDo._id}`, {
      title: _toDo.title,
      due: newDate,
      completed: _toDo.completed,
    });
  };

  if (error) return <h6>{error.message}</h6>;
  if (!_toDo) return null;
  return (
    <div>
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
      <input type="date" value={_toDo.due} onChange={onDueDateChange} />
      {/* Color based on due status */}
      <p>
        {_toDo.completed
          ? "completed"
          : _toDo.due
          ? getTodosDueStatus(new Date(_toDo.due))
          : "no deadline"}
      </p>

      <button type="button" onClick={() => onDeleteToDo(_toDo)}>
        Delete
      </button>
      <h6>
        {" "}
        {savingState === SAVING_STATE.saved && <CheckSquare />}
        {savingState}
      </h6>
    </div>
  );
}
