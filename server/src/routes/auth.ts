import { isEmpty, validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import User from '../entities/User';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { userMiddleware } from '../middlewares/userMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';
import Image from '../entities/Image';

const router = Router();

interface RequestWithFile extends Request {
  file: any; // 혹은 multer.File 타입
}

const mapError = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};

const me = async (req: Request, res: Response) => {
  return res.json(res.locals.user);
};

try {
  fs.accessSync('uploads');
} catch (error) {
  console.error('업로드 폴더 생성');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      // image.png
      const ext = path.extname(file.originalname); // 확장자 추출(png)
      const basename = path.basename(file.originalname, ext); // 이름 추출(image)
      done(null, basename + '_' + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB 이하의 파일만 허용
});

// 회원가입
const signup = async (req: Request, res: Response) => {
  const { email, username, password, imageName } = req.body;

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
    // user.imagePath = imagePath;

    const image = new Image();
    image.src = imageName; // 파일 경로를 이미지의 src로 설정합니다.
    await image.save();

    user.image = image; // User 엔티티에 이미지를 연결합니다.

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
    const user = await User.findOneByOrFail({ email });

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
      cookie.serialize('inplace', token, {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 3,
        path: '/',
      })
    );

    return res.json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

// 로그아웃
const logout = async (_: Request, res: Response) => {
  res.set(
    'Set-Cookie',
    cookie.serialize('inplace', '', {
      httpOnly: false,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    })
  );

  res.status(200).json({ success: true });
};

// 프로필 수정
const updateUser = async (req: Request, res: Response) => {
  const { username: originalUsername } = res.locals.user;
  const { username, imageName } = req.body;

  try {
    let errors: any = {};

    // users db에서 중복체크
    const usernameUser = await User.findOne({ where: { username } });

    // 이미 있으면 error
    if (usernameUser && usernameUser.username !== originalUsername) {
      errors.username = '이미 해당 사용자 이름이 사용되었습니다.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // res.locals.user.id
    const user = await User.findOne({ where: { id: res.locals.user.id }, relations: ['image'] });

    if (!user) {
      return res.status(404).json({ error: '유저를 찾을 수 없습니다.' });
    }

    if (username) {
      user.username = username;
    }

    if (imageName) {
      // Remove old image
      if (user.image) {
        const oldImageId = user.image.id;

        // Set user's imageId to NULL
        user.image = null;
        await user.save();

        // Delete the old image
        const oldImage = await Image.findOne({ where: { id: oldImageId } });
        if (oldImage) {
          await Image.remove(oldImage);
        }
      }

      // Add new image
      const newImage = new Image();
      newImage.src = imageName;
      await newImage.save();

      // Assign new image to the user
      user.image = newImage;
    }

    // Save the updated user
    await user.save();

    return res.json({ message: '유저 정보가 업데이트 되었습니다.', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

// 이미지 업로드
router.post('/images', upload.single('image'), (req: RequestWithFile, res: Response) => {
  return res.json(req.file.filename);
});

router.get('/me', userMiddleware, authMiddleware, me);
router.post('/signup', signup);
router.post('/login', userMiddleware, login);
router.post('/logout', logout);

// 유저 정보 수정 라우터
router.patch('/edit', userMiddleware, authMiddleware, updateUser);

export default router;
