import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILibrary extends Document {
  name: string;
  location: string;
}

const LibrarySchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
});

export const LibraryModel = mongoose.model<ILibrary>('Library', LibrarySchema);
