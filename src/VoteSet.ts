import { AxiomObject } from "axiom-api";

export default class VoteSet {
  // Karma for each user
  karma: { [publicKey: string]: number };

  // Score for each object voted on
  score: { [id: string]: number };

  // Keyed by owner:target
  votes: { [key: string]: AxiomObject };

  constructor(votes: AxiomObject[]) {
    this.karma = {};
    this.score = {};
    this.votes = {};

    for (let vote of votes) {
      this.addVote(vote);
    }
  }

  modify(target: string, owner: string, delta: number) {
    if (this.score[target]) {
      this.score[target] += delta;
    } else {
      this.score[target] = delta;
    }

    if (this.karma[owner]) {
      this.karma[owner] += delta;
    } else {
      this.karma[owner] = delta;
    }
  }

  addVote(vote: AxiomObject) {
    if (Math.abs(vote.data.score) !== 1 || !vote.data.target) {
      return;
    }

    let key = `${vote.owner}:${vote.data.target}`;
    if (this.votes[key]) {
      this.removeVote(this.votes[key]);
    }
    this.modify(vote.data.target, vote.owner, vote.data.score);
    this.votes[key] = vote;
  }

  removeVote(vote: AxiomObject) {
    let key = `${vote.owner}:${vote.data.target}`;
    if (this.votes[key] !== vote) {
      console.log("bad removeVote");
      return;
    }

    delete this.votes[key];
    this.modify(vote.data.target, vote.owner, -vote.data.score);
  }
}
