import mongoose, { Document, Schema } from "mongoose";

export interface IJokeType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const JokeTypeSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

export const JokeType = mongoose.model<IJokeType>("JokeType", JokeTypeSchema);
