import { AxiomObject } from "axiom-api";

export default class VoteSet {
  // Karma for each user
  karma: { [publicKey: string]: number };

  // Score for each object voted on
  score: { [id: string]: number };

  constructor(votes: AxiomObject[]) {
    this.karma = {};
    this.score = {};
  }

  addVote(vote: AxiomObject) {
    throw new Error("XXX");
  }

  removeVote(vote: AxiomObject) {
    throw new Error("XXX");
  }
}
