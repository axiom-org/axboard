import React from "react";
import AxiomAPI, { Channel, Database, KeyPair, SignedMessage } from "axiom-api";

import "./App.css";
import InputForm from "./InputForm";
import LoginForm from "./LoginForm";
import Post from "./Post";

export default function App() {
  let axiom = new AxiomAPI({ network: "alpha", verbose: true });
  let node = axiom.createNode();
  let channel = node.channel("Axboard");
  let postdb = channel.database("Posts");
  let commentdb = channel.database("Comments");

  return (
    <div className="App">
      <PostList postdb={postdb} commentdb={commentdb} channel={channel} />
    </div>
  );
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class PostList extends React.Component<
  {
    postdb: Database;
    commentdb: Database;
    channel: Channel;
  },
  {
    posts: { [key: string]: SignedMessage };
    comments: { [parent: string]: { [key: string]: SignedMessage } };
    keyPair?: KeyPair;
  }
> {
  postdb: Database;
  commentdb: Database;
  channel: Channel;

  constructor(props: {
    postdb: Database;
    commentdb: Database;
    channel: Channel;
  }) {
    super(props);

    this.postdb = props.postdb;
    this.commentdb = props.commentdb;
    this.channel = props.channel;
    this.state = {
      posts: {},
      comments: {},
      keyPair: undefined
    };

    this.postdb.onMessage((sm: SignedMessage) => {
      if (sm.message.type === "Delete") {
        return;
      }
      let key = sm.signer + ":" + sm.message.name;
      let newPosts = { ...this.state.posts };
      newPosts[key] = sm;
      this.setState({ posts: newPosts });
    });

    this.commentdb.onMessage((sm: SignedMessage) => {
      if (sm.message.type === "Delete") {
        return;
      }
      let key = sm.signer + ":" + sm.message.name;
      let parent = sm.message.data.parent;
      let newThread = { ...this.state.comments[parent] };
      newThread[key] = sm;
      let newComments = { ...this.state.comments };
      newComments[parent] = newThread;
      this.setState({ comments: newComments });
    });
  }

  sortedPosts(): SignedMessage[] {
    let posts = [];
    for (let key in this.state.posts) {
      posts.push(this.state.posts[key]);
    }
    posts.sort((a, b) =>
      b.message.timestamp.localeCompare(a.message.timestamp)
    );
    return posts;
  }

  sortedComments(parent: string): SignedMessage[] {
    let comments = [];
    for (let key in this.state.comments[parent]) {
      comments.push(this.state.comments[parent][key]);
    }
    comments.sort((a, b) =>
      a.message.timestamp.localeCompare(b.message.timestamp)
    );
    return comments;
  }

  renderHeader() {
    if (this.state.keyPair) {
      return (
        <div>
          <p>logged in as {this.state.keyPair.getPublicKey()}</p>
          <InputForm
            name={"New post"}
            onSubmit={content => {
              let data = { content: content };
              this.postdb.create(data);
            }}
          />
        </div>
      );
    }
    return (
      <LoginForm
        onSubmit={keyPair => {
          this.channel.setKeyPair(keyPair);
          this.setState({ keyPair });
        }}
      />
    );
  }

  render() {
    return (
      <div>
        <h1>P2P Message Board Proof Of Concept</h1>
        {this.renderHeader()}
        {this.sortedPosts().map((sm, index) => (
          <Post
            key={index}
            post={sm}
            comments={this.sortedComments(sm.signer + ":" + sm.message.name)}
            commentdb={this.commentdb}
            allowReply={!!this.state.keyPair}
          />
        ))}
      </div>
    );
  }
}
