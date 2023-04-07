import { validate } from 'class-validator';
import { Request, Response, Router } from 'express';
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
    if (usernameUser)
      errors.username = '이미 해당 사용자 이름이 사용되었습니다.';

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

router.post('/signup', signup);

export default router;
