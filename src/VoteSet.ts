import { AxiomObject, KeyPair } from "axiom-api";

export default class VoteSet {
  // Karma for each user
  karma: { [publicKey: string]: number };

  // Vote count for each object voted on, not including the implicit self-vote
  voteCount: { [id: string]: number };

  // Keyed by owner:target
  votes: { [key: string]: AxiomObject };

  constructor(votes: AxiomObject[]) {
    this.karma = {};
    this.voteCount = {};
    this.votes = {};

    for (let vote of votes) {
      this.addVote(vote);
    }
  }

  modify(target: string, owner: string, delta: number) {
    if (this.voteCount[target]) {
      this.voteCount[target] += delta;
    } else {
      this.voteCount[target] = delta;
    }

    if (this.karma[owner]) {
      this.karma[owner] += delta;
    } else {
      this.karma[owner] = delta;
    }
  }

  // Includes implicit self-vote
  getVoteCount(id: string): number {
    return 1 + (this.voteCount[id] || 0);
  }

  getScore(obj: AxiomObject): number {
    let vc = this.getVoteCount(obj.id);
    let ms = new Date().getTime() - obj.timestamp.getTime();
    let days = ms / 1000 / 60 / 60 / 24;
    return vc * Math.pow(1 + days, -1.3);
  }

  getKarma(publicKey: string): number {
    return this.karma[publicKey] || 0;
  }

  getVote(owner: string, target: string): AxiomObject | null {
    let key = `${owner}:${target}`;
    return this.votes[key] || null;
  }

  showTo(obj: AxiomObject, keyPair?: KeyPair): boolean {
    if (this.getVoteCount(obj.id) > -10) {
      return true;
    }
    if (!keyPair) {
      return false;
    }
    let pk = keyPair.getPublicKey();
    if (pk === obj.owner) {
      return true;
    }
    if (!obj.data.board) {
      return false;
    }
    if (obj.data.board.startsWith(pk)) {
      return true;
    }
    return false;
  }

  sort(list: AxiomObject[]) {
    list.sort((a, b) => this.getScore(b) - this.getScore(a));
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
