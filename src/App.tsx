import React from "react";
import AxiomAPI, { AxiomObject, Channel, Database, KeyPair } from "axiom-api";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import DataContext from "./DataContext";
import Header from "./Header";
import Loading from "./Loading";
import LoginForm from "./LoginForm";
import PostDetail from "./PostDetail";
import PostList from "./PostList";
import UserDetail from "./UserDetail";
import { daysAgo } from "./Util";

type CommentMap = { [parent: string]: { [key: string]: AxiomObject } };
type AppProps = {};
type AppState = {
  posts: AxiomObject[];
  comments: CommentMap;
  keyPair?: KeyPair;
  username?: string;
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
      username: undefined,
      loading: true
    };

    // Async but no need to wait for a response
    this.loadMainView();

    // Must be async because it can call setState. TODO: refactor and avoid
    setTimeout(() => {
      let username = window.localStorage.getItem("username");
      let passphrase = window.localStorage.getItem("passphrase");
      if (username && passphrase) {
        this.login(username, passphrase);
      }
    }, 0);
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
    let regex = /^[A-Za-z0-9_]+$/;
    if (!regex.test(username)) {
      throw new Error(`invalid username: ${username}`);
    }
    let keyPair = KeyPair.fromSecretPhrase(username + ";" + passphrase);
    this.channel.setKeyPair(keyPair);
    this.setState({ keyPair, username });

    // Save to local storage
    window.localStorage.setItem("username", username);
    window.localStorage.setItem("passphrase", passphrase);
  }

  logout() {
    this.channel.setKeyPair(null);
    this.setState({ keyPair: undefined });
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("passphrase");
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
          username: this.state.username,
          keyPair: this.state.keyPair
        }}
      >
        <div>
          <h1>Axboard</h1>
          <Router>
            <Header />
            <Switch>
              <Route
                path="/post/:id"
                render={({ match }) => <PostDetail id={match.params.id} />}
              />
              <Route
                path="/u/:name/:publicKey"
                render={({ match }) => (
                  <UserDetail
                    name={match.params.name}
                    publicKey={match.params.publicKey}
                  />
                )}
              />
              <Route path="/login">
                <LoginForm />
              </Route>
              <Route path="/">
                <div>
                  <h2>Home Page</h2>
                  <PostList posts={this.state.posts} />
                </div>
              </Route>
            </Switch>
          </Router>
        </div>
      </DataContext.Provider>
    );
  }
}
