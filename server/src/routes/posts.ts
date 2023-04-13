import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userMiddleware } from '../middlewares/userMiddleware';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import Post from '../entities/Post';
import Image from '../entities/Image';
import { AppDataSource } from '../data-source';

const router = Router();

interface RequestWithFile extends Request {
  file: any; // 혹은 multer.File 타입
  files: any[];
}

interface DestinationCallback {
  (error: Error | null, destination: string): void;
}
interface FileNameCallback {
  (error: Error | null, filename: string): void;
}

try {
  fs.accessSync('uploads');
} catch (error) {
  console.error('업로드 폴더 생성');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done: DestinationCallback) {
      done(null, 'uploads');
    },
    filename(req, file, done: FileNameCallback) {
      const ext = path.extname(file.originalname); // 확장자 추출(png)
      const basename = path.basename(file.originalname, ext); // 이름 추출(image)
      done(null, basename + '_' + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB 이하의 파일만 허용
});

const createPost = async (req: Request, res: Response) => {
  const { title, upVote, neutralVote, downVote, desc, imagePath } = req.body;

  const user = res.locals.user;

  try {
    const post = new Post();
    post.title = title;
    post.upVote = upVote;
    post.neutralVote = neutralVote;
    post.downVote = downVote;
    post.desc = desc;
    post.images = imagePath;
    post.username = user;

    await post.save();

    // 이미지 업로드 및 게시물에 연결
    console.log('imagePath>>>', imagePath);

    const savedPost = await Post.findOneBy({ id: post.id });

    const images = [];
    for (const file of imagePath) {
      const image = new Image();
      image.src = file;
      image.post = post;
      await image.save();
      images.push(image);
    }

    for (const image of images) {
      post.images = image.id;
    }

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};
const getAllPosts = async (req: Request, res: Response) => {
  try {
    const allPosts = await Post.find({
      order: { createdAt: 'DESC' },
      relations: ['votes', 'comments', 'images'],
    });

    return res.json(allPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

router.get('/', getAllPosts);
router.post(
  '/images',
  userMiddleware,
  authMiddleware,
  upload.array('postImages'),
  async (req: RequestWithFile, res: Response) => {
    console.log('req>>', req.files);

    // console.log('req.file.path>>> ', req.file);
    return res.json(req.files.map((file) => file.filename));
  }
);
router.post('/', userMiddleware, authMiddleware, createPost);

export default router;

// const getPost = async (req: Request, res: Response) => {
//   const id = req.params.id;

//   try {
//     const post = await Post.findOneOrFail(id);
//     res.json(post);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'something went wrong' });
//   }
// };
