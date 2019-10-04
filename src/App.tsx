import React from "react";
import AxiomAPI, { AxiomObject, Channel, Database, KeyPair } from "axiom-api";

import "./App.css";
import InputForm from "./InputForm";
import Loading from "./Loading";
import LoginForm from "./LoginForm";
import Post from "./Post";

enum Screen {
  Initial = 1,
  Main
}

type PostMap = { [key: string]: AxiomObject };
type CommentMap = { [parent: string]: { [key: string]: AxiomObject } };
type AppProps = {};
type AppState = {
  screen: Screen;
  posts: PostMap;
  comments: CommentMap;
  keyPair?: KeyPair;
  loading: boolean;
};

export default class App extends React.Component<AppProps, AppState> {
  channel: Channel;
  postdb: Database;
  commentdb: Database;

  constructor(props: AppProps) {
    super(props);

    let axiom = new AxiomAPI({ network: "alpha", verbose: true });
    let node = axiom.createNode();
    this.channel = node.channel("Axboard");
    this.postdb = this.channel.database("Posts");
    this.commentdb = this.channel.database("Comments");

    this.state = {
      screen: Screen.Initial,
      posts: {},
      comments: {},
      keyPair: undefined,
      loading: false
    };

    setTimeout(() => {
      this.loadMainView();
    }, 0);
  }

  sortedPosts(): AxiomObject[] {
    let posts = [];
    for (let key in this.state.posts) {
      posts.push(this.state.posts[key]);
    }
    posts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return posts;
  }

  sortedComments(parent: string): AxiomObject[] {
    let comments = [];
    for (let key in this.state.comments[parent]) {
      comments.push(this.state.comments[parent][key]);
    }
    comments.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return comments;
  }

  async loadMainView(): Promise<void> {
    this.setState({ loading: true });
    let postlist = await this.postdb.find({ selector: {} });
    let posts: PostMap = {};
    for (let post of postlist) {
      posts[post.id] = post;
    }
    let commentlist = await this.commentdb.find({ selector: {} });
    let comments: CommentMap = {};
    for (let comment of commentlist) {
      let parent = comment.data.parent;
      if (!comments[parent]) {
        comments[parent] = {};
      }
      comments[parent][comment.id] = comment;
    }
    this.setState({
      screen: Screen.Main,
      posts,
      comments,
      loading: false
    });
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
    if (this.state.screen === Screen.Initial) {
      return <Loading />;
    }

    return (
      <div>
        <h1>P2P Message Board Proof Of Concept</h1>
        {this.renderHeader()}
        {this.sortedPosts().map((post, index) => (
          <Post
            key={index}
            post={post}
            comments={this.sortedComments(post.id)}
            commentdb={this.commentdb}
            allowReply={!!this.state.keyPair}
          />
        ))}
      </div>
    );
  }
}
