import { Joke, IJoke } from "../models/joke";

export class JokeRepository {
  async getPendingJokes() {
    return Joke.find({ status: "pending" });
  }

  async updateJoke(id: string, jokeData: Partial<IJoke>) {
    return Joke.findByIdAndUpdate(id, jokeData, { new: true });
  }

  async approveJoke(id: string) {
    return Joke.findByIdAndUpdate(id, { status: "approved" }, { new: true });
  }

  async rejectJoke(id: string) {
    return Joke.findByIdAndDelete(id);
  }
}
