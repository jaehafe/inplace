import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../entities/User';

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('req.cookies>>>', req.cookies.inplace);
    console.log('req.cookies>>>', req.cookies);

    const token = req.cookies.inplace;

    if (!token) return next();

    // 토큰 검증, email decode
    const userInfo: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log('userInfo // usermiddleware>>', userInfo);

    // 토큰에서 나온 유저 이메일을 db에서 가져오기
    const user = await User.findOneBy({ email: userInfo.email });
    console.log('토큰에서 나온 유저 이메일을 db에서 가져오기>>>', user);

    // 유저 정보를 res.locals에 저장
    res.locals.user = user;
    console.log('usermiddleware res.locals.user>>>', res.locals.user);

    return next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'something went wrong' });
  }
};
