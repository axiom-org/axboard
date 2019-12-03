import React, { useState } from "react";
import { AxiomObject } from "axiom-api";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, Redirect } from "react-router-dom";

import { useDataContext } from "./DataContext";
import ErrorPage from "./ErrorPage";

export default function EditBoard(props: { board: AxiomObject }) {
  let [description, setDescription] = useState(props.board.data.description);
  let [redirect, setRedirect] = useState("");

  if (redirect !== "") {
    return <Redirect to={redirect} />;
  }

  let data = useDataContext();
  if (!data.username) {
    return <Redirect to="/login" />;
  }
  if (data.keyPair.getPublicKey() !== board.owner) {
    return <ErrorPage text="You can only edit boards that you own." />;
  }

  let handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(`updating board with name: ${name}`);
    let board = await data.app.updateBoard({ description }, name);
    console.log(board);
    setRedirect(`/b/${board.name}/${board.id}`);
  };

  return (
    <div>
      <br />
      <h2>
        Edit{" "}
        <Link to={`/b/${board.name}/${board.id}`}>{`b/${board.name}`}</Link>
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
