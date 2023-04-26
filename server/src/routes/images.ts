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

router.post('/images', upload.single('image'), (req: RequestWithFile, res: Response) => {
  return res.json(req.file.filename);
});

export default router;
