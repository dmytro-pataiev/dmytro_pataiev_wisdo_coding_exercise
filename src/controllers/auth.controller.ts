import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { generateToken } from '../middleware/auth.middleware';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (user && user.password === password) {
    const token = generateToken(user);
    
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
};
