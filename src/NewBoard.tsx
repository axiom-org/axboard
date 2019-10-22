import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import { useDataContext } from "./DataContext";

export default function NewBoard() {
  let [name, setName] = useState("");
  let [description, setDescription] = useState("");
  let [redirect, setRedirect] = useState("");

  let data = useDataContext();
  if (!data.username) {
    return <div>You must log in to create a new board.</div>;
  }

  if (redirect !== "") {
    return <Redirect to={redirect} />;
  }

  let handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name.length < 3) {
      alert("name too short");
      return;
    }
    let board = await data.app.createBoard({ name, description });
    setRedirect(`/b/${board.name}/${board.id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        create a new board.
        <br />
        name:
        <br />
        <input
          value={name}
          onChange={e => setName(e.target.value.replace(/\W+/g, ""))}
        />
      </label>
      <label>
        description:
        <br />
        <input
          textarea={description}
          onChange={e => setDescription(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
