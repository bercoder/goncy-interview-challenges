import type {Item} from "./types";

import {useEffect, useState} from "react";

import styles from "./App.module.scss";
import api from "./api";

interface Form extends HTMLFormElement {
  text: HTMLInputElement;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, toggleLoading] = useState<boolean>(true);
  const [isSaving, setSaving] = useState<boolean>(false);

  function handleToggle(id: Item["id"]) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
            }
          : item,
      ),
    );
  }

  function handleAdd(event: React.ChangeEvent<Form>) {
    event.preventDefault();

    const text = event.target.text.value;

    if (!text.trim() || isSaving) return;

    setSaving(true);

    setTimeout(() => {
      setItems((items) =>
        items.concat({
          id: +new Date(),
          completed: false,
          text,
        }),
      );
      setSaving(false);
    }, 1000);

    event.target.text.value = "";
  }

  function handleRemove(id: Item["id"]) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  useEffect(() => {
    api
      .list()
      .then(setItems)
      .finally(() => toggleLoading(false));
  }, []);

  if (isLoading) return "Loading...";

  return (
    <main className={styles.main}>
      <h1>Supermarket list</h1>
      <form onSubmit={handleAdd}>
        <input autoFocus name="text" type="text" />
        <button disabled={isSaving}>{isSaving ? "Saving" : "Add"}</button>
      </form>
      <ul>
        {items?.map((item) => (
          <li
            key={item.id}
            className={item.completed ? styles.completed : ""}
            onClick={() => handleToggle(item.id)}
          >
            {item.text} <button onClick={() => handleRemove(item.id)}>[X]</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
