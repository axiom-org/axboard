import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Redirect } from "react-router-dom";

import { useDataContext } from "./DataContext";
import ErrorPage from "./ErrorPage";

export default function EditComment(props: { parent: string; id: string }) {
  let data = useDataContext();
  let siblings = data.comments[parent] || {};
  let comment = siblings[id];
  let initialContent = (comment && comment.data.content) || "";
  let [content, setContent] = useState(initialContent);
  let [redirect, setRedirect] = useState("");

  let done = () => setRedirect(`/post/${comment.data.post}`);

  if (redirect !== "") {
    return <Redirect to={redirect} />;
  }
  if (!comment) {
    return <ErrorPage text="The information for this comment was not found." />;
  }
  if (!data.keyPair) {
    return <Redirect to="/login" />;
  }
  if (data.keyPair.getPublicKey() !== comment.owner) {
    return <ErrorPage text="You can only edit comments that you own." />;
  }

  let handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(`updating comment with new content: ${content}`);
    await data.app.updateComment(comment.name, {
      author: comment.data.author,
      board: comment.data.board,
      content,
      post: comment.data.post,
      parent: comment.data.parent
    });
    done();
  };

  return (
    <div>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Edit comment:</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            value={content}
            onChange={(e: any) => setContent(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          value="Submit"
          disabled={content.length <= 1}
        >
          Submit
        </Button>
        <Button
          style={{ marginLeft: "20px" }}
          variant="outline-secondary"
          onClick={done}
          value="Cancel"
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
}
