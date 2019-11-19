import React, { useState } from "react";
import { AxiomObject } from "axiom-api";
import { Link, Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useDataContext } from "./DataContext";

function BoardDropDown(props: {
  boards: AxiomObject[];
  selected?: string;
  onSelect: (id: string) => void;
}) {
  let onChange = (e: any) => {
    let value = e.target.value || undefined;
    props.onSelect(value);
  };
  return (
    <Form.Group>
      <Form.Label>Board</Form.Label>
      <Form.Control as="select" selected={props.selected} onChange={onChange}>
        <option value="" key="">
          select a board to post to
        </option>
        {props.boards.map(board => (
          <option value={board.id} key={board.id}>
            {board.name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
}

export default function NewPost(props: { board?: string }) {
  let data = useDataContext();
  let [id, setID] = useState("");
  let [title, setTitle] = useState("");
  let [summary, setSummary] = useState("");
  let [url, setURL] = useState("");
  let [boardID, setBoardID] = useState(props.board);

  if (id.length > 0) {
    return <Redirect to={`/post/${id}`} />;
  }
  if (!data.username) {
    return <Redirect to={"/login"} />;
  }

  let author: string = data.username;

  let handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!boardID) {
      return;
    }
    if (summary.trim().length === 0 || title.trim().length === 0) {
      return;
    }
    console.log(`posting ${title} to ${boardID}`);
    let post = await data.app.createPost({
      author,
      board: boardID,
      summary,
      title,
      url
    });
    setID(post.id);
  };

  let boards = Object.values(data.boards);
  boards.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <br />
      <h2>New Post</h2>
      <br />
      <Form onSubmit={handleSubmit}>
        {!props.board && (
          <BoardDropDown
            boards={boards}
            selected={boardID}
            onSelect={setBoardID}
          />
        )}
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>URL</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            value={url}
            onChange={(e: any) => setURL(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Summary</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            value={summary}
            onChange={(e: any) => setSummary(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" value="Submit">
          Submit
        </Button>
      </Form>
      <br />
      <Link to="/newboard">create a new board</Link>
    </div>
  );
}
