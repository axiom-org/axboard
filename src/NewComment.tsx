import React, { useState } from "react";
import { AxiomObject } from "axiom-api";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

import { useDataContext } from "./DataContext";

export default function NewComment(props: {
  post: AxiomObject;
  parent?: AxiomObject;
  cancel?: () => void;
}) {
  let data = useDataContext();
  let [content, setContent] = useState("");
  let [done, setDone] = useState(false);

  if (!data.username) {
    return null;
  }
  let author: string = data.username;

  if (done) {
    return null;
  }

  let handleSubmit = async (e: any) => {
    e.preventDefault();
    let commentData: any = {
      author,
      board: props.post.data.board,
      content,
      post: props.post.id,
      parent: props.parent && props.parent.id
    };
    console.log(`commenting ${content.length} bytes. post = ${props.post.id}`);
    await data.app.createComment(commentData);
    props.cancel && props.cancel();
    setDone(true);
  };

  return (
    <Card style={{ marginTop: "10px" }}>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            {!props.parent && <Form.Label>Add a comment:</Form.Label>}
            <Form.Control
              as="textarea"
              rows="3"
              value={content}
              placeholder="What do you think?"
              onChange={(e: any) => setContent(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            value="Comment"
            disabled={content.length <= 1}
          >
            {props.parent ? "Reply" : "Comment"}
          </Button>
          {props.cancel && (
            <Button
              style={{ marginLeft: "20px" }}
              variant="outline-secondary"
              onClick={props.cancel}
              value="Cancel"
            >
              Cancel
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}
