import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthor extends Document {
  name: string;
  country: string;
}

const AuthorSchema: Schema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
});

export const AuthorModel = mongoose.model<IAuthor>('Author', AuthorSchema);
