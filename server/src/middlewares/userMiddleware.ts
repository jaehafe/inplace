import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../entities/User';

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.inplace;

    if (!token) return next();

    // 토큰 검증, email decode
    const userInfo: any = jwt.verify(token, process.env.JWT_SECRET);

    // 토큰에서 나온 유저 이메일을 db에서 가져오기
    const user = await User.findOneBy(userInfo.username);

    // 유저 정보를 res.locals에 저장
    res.locals.user = user;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'something went wrong' });
  }
};
