import { isEmpty, validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import User from '../entities/User';

const router = Router();

const mapError = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};

const signup = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  console.log(email, username, password);

  try {
    let errors: any = {};

    // users db에서 중복체크
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    // 이미 있으면 error
    if (emailUser) errors.email = '이미 해당 이메일이 사용되었습니다.';
    if (usernameUser) errors.username = '이미 해당 사용자 이름이 사용되었습니다.';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // user 인스턴스 생성 및 유효성 검사
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(mapError(errors));

    await user.save();

    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

// 로그인
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(email)) errors.email = '이메일은 비워둘 수 없습니다.';
    if (isEmpty(password)) errors.password = '비밀번호는 비워둘 수 없습니다.';
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // db에서 email로 유저 찾기
    const user = await User.findOneBy({ email });

    // 해당하는 email의 user가 없으면 에러 보내기
    if (!user) return res.status(404).json({ email: '가입한 이메일이 없습니다.' });

    // 유저가 있다면 db의 비밀번호와 입력한 비밀번호 비교
    const passwordMatches = await bcrypt.compare(password, user.password);

    // 비밀번호가 다르면 에러 보내기
    if (!passwordMatches) {
      return res.status(401).json({ password: '비밀번호가 잘못되었습니다.' });
    }

    // 비밀번호가 맞으면 토큰 생성
    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    // 쿠키 저장
    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    );

    return res.json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

router.post('/signup', signup);
router.post('/login', login);

export default router;
