import React, { useState } from "react";
import "./App.css";

import AxiomAPI from "axiom-api";

export default function App() {
  let axiom = new AxiomAPI({ network: "alpha", verbose: true });
  let node = axiom.createNode();
  let channel = node.channel("Axboard");
  let postdb = channel.database("Posts");
  let commentdb = channel.database("Comments");

  return (
    <div className="App">
      <PostList postdb={postdb} commentdb={commentdb} />
    </div>
  );
}

class PostList extends React.Component {
  constructor(props) {
    super(props);

    this.postdb = props.postdb;
    this.commentdb = props.commentdb;
    this.state = {
      posts: {},
      comments: {}
    };

    setInterval(() => {
      this.postdb.load();
      this.commentdb.load();
    }, 1000);

    this.postdb.onMessage(sm => {
      if (sm.message.type === "Delete") {
        return;
      }
      let key = sm.signer + ":" + sm.message.id;
      let newPosts = { ...this.state.posts };
      newPosts[key] = sm;
      this.setState({ posts: newPosts });
    });

    this.commentdb.onMessage(sm => {
      if (sm.message.type === "Delete") {
        return;
      }
      let key = sm.signer + ":" + sm.message.id;
      let parent = sm.message.data.parent;
      let newThread = { ...this.state.comments[parent] };
      newThread[key] = sm;
      let newComments = { ...this.state.comments };
      newComments[parent] = newThread;
      this.setState({ comments: newComments });
    });
  }

  sortedPosts() {
    let posts = [];
    for (let key in this.state.posts) {
      posts.push(this.state.posts[key]);
    }
    posts.sort((a, b) =>
      b.message.timestamp.localeCompare(a.message.timestamp)
    );
    return posts;
  }

  sortedComments(parent) {
    let comments = [];
    for (let key in this.state.comments[parent]) {
      comments.push(this.state.comments[parent][key]);
    }
    comments.sort((a, b) =>
      a.message.timestamp.localeCompare(b.message.timestamp)
    );
    return comments;
  }

  render() {
    return (
      <div>
        <h1>P2P Message Board Proof Of Concept</h1>
        <InputForm
          name={"New post"}
          onSubmit={content => {
            let data = { content: content };
            this.postdb.create(data);
          }}
        />
        {this.sortedPosts().map((sm, index) => (
          <Post
            key={index}
            post={sm}
            comments={this.sortedComments(sm.signer + ":" + sm.message.id)}
            commentdb={this.commentdb}
          />
        ))}
      </div>
    );
  }
}

function Post(props) {
  return (
    <div>
      <hr />
      <p>Post: {props.post.message.data.content}</p>
      {props.comments.map((sm, index) => (
        <p key={index}>Comment: {sm.message.data.content}</p>
      ))}
      <InputForm
        name={"Reply"}
        onSubmit={content => {
          let parent = props.post.signer + ":" + props.post.message.id;
          let data = {
            parent: parent,
            content: content
          };
          props.commentdb.create(data);
        }}
      />
    </div>
  );
}

function InputForm(props) {
  let [content, setContent] = useState("");

  let handleSubmit = e => {
    e.preventDefault();
    console.log(`submitting ${content}`);
    props.onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {props.name}:<br />
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
