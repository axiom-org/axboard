import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import { useDataContext } from "./DataContext";

export default function NewBoard() {
  let [name, setName] = useState("");
  let [description, setDescription] = useState("");
  let [redirect, setRedirect] = useState("");

  let data = useDataContext();
  if (!data.username) {
    return <Redirect to="/login" />;
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
    console.log(`creating board with name: ${name}`);
    let board = await data.app.createBoard({ description }, name);
    console.log(board);
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
          onChange={e => setName(e.target.value.replace(/[\W_]/g, ""))}
        />
      </label>
      <label>
        description:
        <br />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
