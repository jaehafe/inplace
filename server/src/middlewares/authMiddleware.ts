import { NextFunction, Request, Response } from 'express';
import User from '../entities/User';

export const authMiddleware = (_: Request, res: Response, next: NextFunction) => {
  try {
    console.log('auth res.locals.user>>>', res.locals.user);

    const user: User | undefined = res.locals.user;
    console.log('authmiddleware>>>', user);

    if (!user) throw new Error('Unauthenticated!!!');

    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthenticated!!!' });
  }
};
