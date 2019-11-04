import React from "react";
import Axiom, { AxiomObject, Channel, Database, KeyPair } from "axiom-api";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";

import "./App.css";
import BoardPage from "./BoardPage";
import DataContext from "./DataContext";
import Header from "./Header";
import HomePage from "./HomePage";
import Loading from "./Loading";
import LoginForm from "./LoginForm";
import NewBoard from "./NewBoard";
import PostDetail from "./PostDetail";
import UserDetail from "./UserDetail";
import { daysAgo } from "./Util";
import VoteSet from "./VoteSet";

type ObjectMap = { [id: string]: AxiomObject };
type CommentMap = { [parent: string]: ObjectMap };
type AppProps = {};
type AppState = {
  posts: ObjectMap;
  comments: CommentMap;
  votes: VoteSet;
  boards: ObjectMap;
  keyPair?: KeyPair;
  username?: string;
  loading: boolean;
};

export default class App extends React.Component<AppProps, AppState> {
  channel: Channel;
  postdb: Database;
  commentdb: Database;
  votedb: Database;
  boarddb: Database;

  constructor(props: AppProps) {
    super(props);

    let axiom = new Axiom({ network: "prod", verbose: true });
    this.channel = axiom.channel("Axboard");

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
    this.votedb = this.channel.database("Votes");
    this.boarddb = this.channel.database("Boards");

    this.state = {
      posts: {},
      comments: {},
      votes: new VoteSet([]),
      boards: {},
      keyPair: undefined,
      username: undefined,
      loading: true
    };

    // Async but we can't wait for a response in this constructor
    this.loadData();

    // Must be async because it can call setState. TODO: refactor and avoid
    setTimeout(() => {
      let username = window.localStorage.getItem("username");
      let passphrase = window.localStorage.getItem("passphrase");
      if (username && passphrase) {
        this.login(username, passphrase);
      }
    }, 0);
  }

  async loadData(): Promise<void> {
    await this.postdb.waitForLoad();
    await this.commentdb.waitForLoad();
    await this.votedb.waitForLoad();
    await this.boarddb.waitForLoad();

    let postlist = await this.postdb.find({ selector: {} });
    let posts: ObjectMap = {};
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

    let votelist = await this.votedb.find({ selector: {} });
    let votes = new VoteSet(votelist);

    let boardlist = await this.boarddb.find({ selector: {} });
    let boards: ObjectMap = {};
    for (let board of boardlist) {
      boards[board.id] = board;
    }

    this.setState({
      posts,
      comments,
      votes,
      boards,
      loading: false
    });
  }

  async createPost(args: {
    author: string;
    board: string;
    content: string;
  }): Promise<AxiomObject> {
    let post = await this.postdb.create(args);
    this.setState(state => {
      let newPosts = { ...state.posts };
      newPosts[post.id] = post;
      return { ...state, posts: newPosts };
    });
    return post;
  }

  async createComment(args: {
    author: string;
    board: string;
    content: string;
    parent: string;
  }): Promise<AxiomObject> {
    let comment = await this.commentdb.create(args);
    this.setState(state => {
      let newCommentSubmap = { ...state.comments[args.parent] };
      newCommentSubmap[comment.id] = comment;
      let newComments = { ...state.comments };
      newComments[args.parent] = newCommentSubmap;
      return { ...state, comments: newComments };
    });
    return comment;
  }

  async createBoard(
    args: {
      description: string;
    },
    name: string
  ): Promise<AxiomObject> {
    let board = await this.boarddb.create(args, name);
    this.setState(state => {
      let newBoards = { ...state.boards };
      newBoards[board.id] = board;
      return { ...state, boards: newBoards };
    });
    return board;
  }

  async vote(args: { target: string; score: number }): Promise<AxiomObject> {
    let vote = await this.votedb.create(args);
    this.state.votes.addVote(vote);
    this.forceUpdate();
    return vote;
  }

  async upvote(target: string): Promise<AxiomObject> {
    return await this.vote({ target, score: 1 });
  }

  async downvote(target: string): Promise<AxiomObject> {
    return await this.vote({ target, score: -1 });
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
          votes: this.state.votes,
          boards: this.state.boards,
          username: this.state.username,
          keyPair: this.state.keyPair
        }}
      >
        <Router>
          <h1>
            <Link to="/">Axboard</Link>
          </h1>
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
            <Route
              path="/b/:name/:id"
              render={({ match }) => (
                <BoardPage name={match.params.name} id={match.params.id} />
              )}
            />
            <Route path="/login">
              <LoginForm />
            </Route>
            <Route path="/newboard">
              <NewBoard />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </DataContext.Provider>
    );
  }
}
