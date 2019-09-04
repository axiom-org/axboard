import React, { useState } from "react";
import "./App.css";

import AxiomAPI from "axiom-api";

export default function App() {
  let axiom = new AxiomAPI({ network: "alpha", verbose: true });
  let node = axiom.createNode();
  let database = node.database("comments");

  return (
    <div className="App">
      <Chat database={database} />
    </div>
  );
}

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.database = props.database;
    this.state = {
      comments: {}
    };

    setInterval(() => {
      this.database.load();
    }, 1000);

    this.database.onMessage(sm => {
      if (sm.message.type === "Delete") {
        return;
      }
      let key = sm.signer + ":" + sm.message.id;
      let newComments = { ...this.state.comments };
      newComments[key] = sm;
      this.setState({ comments: newComments });
    });
  }

  sortedComments() {
    let comments = [];
    for (let key in this.state.comments) {
      comments.push(this.state.comments[key]);
    }
    comments.sort((a, b) =>
      a.message.timestamp.localeCompare(b.message.timestamp)
    );
    return comments;
  }

  render() {
    return (
      <div>
        <h1>P2P Chat Proof Of Concept</h1>
        <CommentForm database={this.database} />
        {this.sortedComments().map((sm, index) => (
          <p key={index}>{sm.message.data.comment}</p>
        ))}
      </div>
    );
  }
}

function CommentForm(props) {
  let [comment, setComment] = useState("");

  let handleSubmit = e => {
    e.preventDefault();
    console.log(`submitting ${comment}`);
    let data = {
      comment: comment
    };
    setComment("");
    props.database.create(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Comment:
        <br />
        <input
          type="text"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
