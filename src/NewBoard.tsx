import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

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
    <div>
      <br />
      <h2>New Board</h2>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            placeholder="The name of your new board."
            onChange={(e: any) => setName(e.target.value.replace(/[\W_]/g, ""))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            value={description}
            placeholder="Describe what sort of posts you want on this board."
            onChange={(e: any) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" value="Submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
