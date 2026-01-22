import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const getJwtSecret = () => process.env.JWT_SECRET || 'super_secret_key';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
    country: string;
    libraries: string[];
    role?: string;
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    jwt.verify(token, getJwtSecret(), (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export const generateToken = (user: any) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      country: user.country,
      libraries: user.libraries.map((id: any) => id.toString()),
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: '1h' }
  );
};
