import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  country: string;
  libraries: Types.ObjectId[];
  role?: 'admin' | 'user';
  password?: string; // For login simulation
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  libraries: [{ type: Schema.Types.ObjectId, ref: 'Library' }],
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
