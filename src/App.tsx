import React from "react";
import AxiomAPI, { AxiomObject, Channel, Database, KeyPair } from "axiom-api";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import InputForm from "./InputForm";
import Loading from "./Loading";
import LoginForm from "./LoginForm";
import Post from "./Post";
import { daysAgo } from "./Util";

type CommentMap = { [parent: string]: { [key: string]: AxiomObject } };
type AppProps = {};
type AppState = {
  posts: AxiomObject[];
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
    let postFilter = (post: AxiomObject): boolean => {
      let age = daysAgo(post.timestamp);
      if (age > 2 || age < -0.05) {
        return false;
      }
      return true;
    };
    this.postdb.useFilter(postFilter);

    this.commentdb = this.channel.database("Comments");

    this.state = {
      posts: [],
      comments: {},
      keyPair: undefined,
      loading: true
    };

    setTimeout(() => {
      this.loadMainView();
    }, 0);
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
    let posts = await this.postdb.find({ selector: {} });
    posts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
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
            onSubmit={async content => {
              let data = { content: content };
              let post = await this.postdb.create(data);
              this.setState(state => ({
                posts: [post].concat(state.posts)
              }));
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

  renderPostList() {
    return (
      <div>
        <h1>P2P Message Board Proof Of Concept</h1>
        {this.renderHeader()}
        {this.state.posts.map((post, index) => (
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

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <Router>
        <Switch>
          <Route path="/">{this.renderPostList()}</Route>
        </Switch>
      </Router>
    );
  }
}
