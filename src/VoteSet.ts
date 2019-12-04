import { AxiomObject } from "axiom-api";

export default class VoteSet {
  // Karma for each user
  karma: { [publicKey: string]: number };

  // Score for each object voted on, not including the implicit self-vote
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

  // Score which does include implicit self-vote
  getScore(id: string): number {
    return 1 + (this.score[id] || 0);
  }

  getKarma(publicKey: string): number {
    return this.karma[publicKey] || 0;
  }

  getVote(owner: string, target: string): AxiomObject | null {
    let key = `${owner}:${target}`;
    return this.votes[key] || null;
  }

  sort(list: AxiomObject[]) {
    list.sort(
      (a, b) =>
        this.getScore(b.id) - this.getScore(a.id) ||
        b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  addVote(vote: AxiomObject) {
    if (!vote.data.target) {
      return;
    }
    let votee = vote.data.target.split(":")[0];
    if (votee === vote.owner) {
      // No self-votes
      return;
    }

    let key = `${vote.owner}:${vote.data.target}`;
    if (this.votes[key]) {
      this.removeVote(this.votes[key]);
    }
    this.modify(vote.data.target, votee, vote.data.score);
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
    vote.forget();
  }
}
