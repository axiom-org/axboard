import React from "react";
import Axiom, { AxiomObject, Channel, Database, KeyPair } from "axiom-api";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "./App.css";

import About from "./About";
import BoardPage from "./BoardPage";
import DataContext from "./DataContext";
import DevMode from "./DevMode";
import EditBoard from "./EditBoard";
import EditComment from "./EditComment";
import Header from "./Header";
import HomePage from "./HomePage";
import Loading from "./Loading";
import LoginForm from "./LoginForm";
import NewBoard from "./NewBoard";
import NewPost from "./NewPost";
import Page404 from "./Page404";
import PostDetail from "./PostDetail";
import UserDetail from "./UserDetail";
import { daysAgo } from "./Util";
import { validatePost } from "./Validation";
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
  progress: number;
};

// For debugging
declare var window: any;

function objectsToShow(
  votes: VoteSet,
  input: ObjectMap,
  kp?: KeyPair
): ObjectMap {
  let output: ObjectMap = {};
  for (let key in input) {
    let val = input[key];
    if (votes.showTo(val, kp)) {
      output[key] = val;
    }
  }
  return output;
}

export default class App extends React.Component<AppProps, AppState> {
  axiom: Axiom;
  channel: Channel;
  postdb: Database;
  commentdb: Database;
  votedb: Database;
  boarddb: Database;

  constructor(props: AppProps) {
    super(props);
    window.app = this;

    this.axiom = new Axiom({ network: "prod", verbose: true });
    this.channel = this.axiom.channel("Axboard");

    this.postdb = this.channel.database("Posts");
    this.commentdb = this.channel.database("Comments");
    this.votedb = this.channel.database("Votes");
    this.boarddb = this.channel.database("Boards");

    let ageFilter = (obj: AxiomObject): boolean => {
      let age = daysAgo(obj.timestamp);
      if (age > 14 || age < -0.05) {
        return false;
      }
      return true;
    };

    this.postdb.useFilter(
      (post: AxiomObject) => ageFilter(post) && !validatePost(post.data)
    );
    this.commentdb.useFilter(ageFilter);
    this.votedb.useFilter(ageFilter);

    this.state = {
      posts: {},
      comments: {},
      votes: new VoteSet([]),
      boards: {},
      keyPair: undefined,
      username: undefined,
      loading: true,
      progress: 0
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
      this.checkProgress();
    }, 0);
  }

  checkProgress() {
    let progress = this.getProgress();
    this.setState({ progress });
    if (progress < 0.9999) {
      setTimeout(() => this.checkProgress(), 30);
    }
  }

  // From 0 to 1
  getProgress(): number {
    let progress = 0;
    let members = this.axiom.channelMembers["Axboard"];
    if (members && members.getMembers().length >= 2) {
      progress += 1;
    }
    if (!this.postdb.onLoad) {
      progress += 1;
    }
    if (!this.commentdb.onLoad) {
      progress += 1;
    }
    if (!this.votedb.onLoad) {
      progress += 1;
    }
    if (!this.boarddb.onLoad) {
      progress += 1;
    }
    return progress / 5.0;
  }

  async loadData(): Promise<void> {
    // TODO: load a smaller subset of data
    let postlist = await this.postdb.waitForLoad({ selector: {} });
    let commentlist = await this.commentdb.waitForLoad({ selector: {} });
    let votelist = await this.votedb.waitForLoad({ selector: {} });
    let boardlist = await this.boarddb.waitForLoad({ selector: {} });

    let posts: ObjectMap = {};
    for (let post of postlist) {
      posts[post.id] = post;
    }

    let comments: CommentMap = {};
    for (let comment of commentlist) {
      let post = comment.data.post;
      if (!comments[post]) {
        comments[post] = {};
      }
      comments[post][comment.id] = comment;
    }

    let votes = new VoteSet(votelist);

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
    summary: string;
    title: string;
    url?: string;
  }): Promise<AxiomObject> {
    let post = await this.postdb.create(args);
    this.setState(state => {
      let newPosts = { ...state.posts };
      newPosts[post.id] = post;
      return { ...state, posts: newPosts };
    });
    return post;
  }

  addCommentToState(comment: AxiomObject) {
    if (!comment.data.post) {
      throw new Error("bad comment");
    }
    this.setState(state => {
      let newCommentSubmap = { ...state.comments[comment.data.post] };
      newCommentSubmap[comment.id] = comment;
      let newComments = { ...state.comments };
      newComments[comment.data.post] = newCommentSubmap;
      return { ...state, comments: newComments };
    });
  }

  async createComment(args: {
    author: string;
    board: string;
    content: string;
    post: string;
    parent?: string;
  }): Promise<AxiomObject> {
    let comment = await this.commentdb.create(args);
    this.addCommentToState(comment);
    return comment;
  }

  async updateComment(
    name: string,
    args: {
      author: string;
      board: string;
      content: string;
      post: string;
      parent?: string;
    }
  ): Promise<AxiomObject> {
    let comment = await this.commentdb.update(name, args);
    this.addCommentToState(comment);
    return comment;
  }

  addBoardToState(board: AxiomObject) {
    this.setState(state => {
      let newBoards: ObjectMap = { ...state.boards };
      newBoards[board.id] = board;
      return { ...state, boards: newBoards };
    });
  }

  async createBoard(
    args: {
      description: string;
    },
    name: string
  ): Promise<AxiomObject> {
    let board = await this.boarddb.create(args, name);
    this.addBoardToState(board);
    return board;
  }

  async updateBoard(
    args: {
      description: string;
    },
    name: string
  ): Promise<AxiomObject> {
    let board = await this.boarddb.update(name, args);
    this.addBoardToState(board);
    return board;
  }

  async vote(args: { target: string; score: number }): Promise<AxiomObject> {
    // Redundant, but helps data-layer protocols not cache duplicate votes
    let name = args.target.slice(0, 10) + args.target.slice(-10);

    let vote = await this.votedb.create(args, name);
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

  async unvote(target: string): Promise<AxiomObject> {
    return await this.vote({ target, score: 0 });
  }

  async censor(target: string): Promise<AxiomObject> {
    return await this.vote({ target, score: -1000 });
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
    if (DevMode.isActive()) {
      DevMode.addToAuth(username, passphrase);
    }
  }

  logout() {
    this.channel.setKeyPair(null);
    this.setState({ keyPair: undefined });
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("passphrase");
  }

  renderContent() {
    if (this.state.loading) {
      return <Loading progress={this.state.progress} />;
    }

    return (
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
        <Route
          path="/newpost/:board"
          render={({ match }) => <NewPost board={match.params.board} />}
        />
        <Route path="/newpost">
          <NewPost />
        </Route>
        <Route
          path="/editboard/:id"
          render={({ match }) => <EditBoard id={match.params.id} />}
        />
        <Route
          path="/editcomment/:post/:id"
          render={({ match }) => <EditComment {...match.params} />}
        />
        <Route path="/about">
          <About />
        </Route>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route>
          <Page404 />
        </Route>
      </Switch>
    );
  }

  render() {
    let posts = objectsToShow(
      this.state.votes,
      this.state.posts,
      this.state.keyPair
    );
    let comments: CommentMap = {};
    for (let parent in this.state.comments) {
      comments[parent] = objectsToShow(
        this.state.votes,
        this.state.comments[parent],
        this.state.keyPair
      );
    }

    let postsForBoard: {
      [boardID: string]: { [postID: string]: AxiomObject };
    } = {};
    for (let postID in posts) {
      let post = posts[postID];
      if (!postsForBoard[post.data.board]) {
        postsForBoard[post.data.board] = {};
      }
      postsForBoard[post.data.board][postID] = post;
    }

    return (
      <DataContext.Provider
        value={{
          app: this,
          posts,
          comments,
          votes: this.state.votes,
          boards: this.state.boards,
          username: this.state.username,
          keyPair: this.state.keyPair,
          postsForBoard
        }}
      >
        <Router>
          <Header />
          <Container>
            <Row>
              <Col>{this.renderContent()}</Col>
            </Row>
          </Container>
        </Router>
      </DataContext.Provider>
    );
  }
}
