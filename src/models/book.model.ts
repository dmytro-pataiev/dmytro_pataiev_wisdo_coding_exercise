import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: Types.ObjectId;
  authorName: string;
  authorCountry: string;
  publishedDate: Date;
  pages: number;
  library: Types.ObjectId;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  authorName: { type: String, required: true, select: true }, // denormalized for performance
  authorCountry: { type: String, required: true, select: true }, // denormalized for performance
  publishedDate: { type: Date, required: true },
  pages: { type: Number, required: true, min: 1 },
  library: { type: Schema.Types.ObjectId, ref: 'Library', required: true },
});

export const BookModel = mongoose.model<IBook>('Book', BookSchema);
