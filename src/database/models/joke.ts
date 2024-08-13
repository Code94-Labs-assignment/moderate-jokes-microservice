import mongoose, { Document, Schema } from "mongoose";

export interface IJoke extends Document {
  setup: string;
  punchline: string;
  type: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
  author: string;
}

const JokeSchema: Schema = new Schema({
  setup: { type: String, required: true },
  punchline: { type: String, required: true },
  type: {
    _id: { type: Schema.Types.ObjectId, ref: "JokeType", required: true },
    name: { type: String, required: true },
  },
  author: { type: String, default: "Anonymous" },
});

export const Joke = mongoose.model<IJoke>("Joke", JokeSchema);
