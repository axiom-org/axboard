import React from "react";

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
    let board = await data.app.createBoard({ name, description });
    setRedirect(`/b/${board.name}/${board.id}`);
  };

  return <div>TODO</div>;
}
