import { useState, useRef } from "react";

// This object specify different state of auto save
const SAVING_STATE = Object.freeze({
  notSaved: "not saved",
  saving: "saving...",
  saved: "saved",
});
// This hook is used for auto save functionality
const useAutoSave = (setData, setSavingState) => {
  const [error, setError] = useState();
  const timerRef = useRef();

  const save = (method = "get", url, body, propagateChange = null) => {
    if (!url) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setData(body);
    timerRef.current = setTimeout(() => {
      setSavingState(SAVING_STATE.saving);
      body = typeof body === "string" ? body : JSON.stringify(body);
      const headers = {
        "Content-Type": "application/json",
      };
      fetch(url, { method, headers, body })
        .then((res) => {
          if (res.status < 200 || res.status > 299) {
            throw new Error(`API returned with status code ${res.status}`);
          }
        })
        .then(() => {
          propagateChange && propagateChange();
          setSavingState(SAVING_STATE.saved);
        })
        .catch((error) => {
          setSavingState(SAVING_STATE.notSaved);
          setError(error);
        });
    }, 1000);
  };

  return [error, save];
};

export { useAutoSave, SAVING_STATE };
