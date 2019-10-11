import React from "react";
import AxiomAPI, { AxiomObject, Channel, Database, KeyPair } from "axiom-api";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import InputForm from "./InputForm";
import Loading from "./Loading";
import LoginForm from "./LoginForm";
import Post from "./Post";
import { setRoot } from "./Root";
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
    setRoot(this);

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

    // Async but no need to wait for a response
    this.loadMainView();
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
        <h2>Home Page</h2>
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

  renderPostDetail(id: string) {
    return (
      <div>
        <h2>Post Detail ({id})</h2>
        <p>TODO: implement me</p>
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <div>
        <h1>Axboard</h1>
        {this.renderHeader()}
        <Router>
          <Switch>
            <Route
              path="/post/:id"
              render={({ match }) => this.renderPostDetail(match.params.id)}
            />
            <Route path="/">{this.renderPostList()}</Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
