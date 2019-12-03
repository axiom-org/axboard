import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Redirect } from "react-router-dom";

import BoardReference from "./BoardReference";
import { useDataContext } from "./DataContext";
import ErrorPage from "./ErrorPage";

export default function EditBoard(props: { id: string }) {
  let data = useDataContext();
  let board = data.boards[props.id];
  let initialDescription: string = board ? board.data.description : "";
  let [description, setDescription] = useState(initialDescription);
  let [redirect, setRedirect] = useState("");

  if (redirect !== "") {
    return <Redirect to={redirect} />;
  }
  if (!board) {
    return <ErrorPage text="The information for this board was not found." />;
  }
  if (!data.keyPair) {
    return <Redirect to="/login" />;
  }
  if (data.keyPair.getPublicKey() !== board.owner) {
    return <ErrorPage text="You can only edit boards that you own." />;
  }

  let handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(`updating board with name: ${board.name}`);
    let newBoard = await data.app.updateBoard({ description }, board.name);
    console.log(newBoard);
    setRedirect(`/b/${board.name}/${board.id}`);
  };

  return (
    <div>
      <br />
      <h2>
        Edit <BoardReference board={board} />
      </h2>
      <br />
      <Form onSubmit={handleSubmit}>
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
