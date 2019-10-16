import React from "react";
import AxiomAPI, { AxiomObject, Channel, Database, KeyPair } from "axiom-api";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import DataContext from "./DataContext";
import Header from "./Header";
import Loading from "./Loading";
import PostDetail from "./PostDetail";
import PostList from "./PostList";
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

    // Async but no need to wait for a response
    this.loadMainView();
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

  login(username: string, passphrase: string) {
    throw new Error("TODO");
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <DataContext.Provider
        value={{
          app: this,
          posts: this.state.posts,
          comments: this.state.comments,
          keyPair: this.state.keyPair
        }}
      >
        <div>
          <h1>Axboard</h1>
          <Header />
          <Router>
            <Switch>
              <Route
                path="/post/:id"
                render={({ match }) => <PostDetail id={match.params.id} />}
              />
              <Route path="/">
                <PostList commentdb={this.commentdb} />
              </Route>
            </Switch>
          </Router>
        </div>
      </DataContext.Provider>
    );
  }
}
