import { NextFunction, Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userMiddleware } from '../middlewares/userMiddleware';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import Post from '../entities/Post';
import Image from '../entities/Image';
import { AppDataSource } from '../data-source';
import Comment from '../entities/Comment';
import User from '../entities/User';

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
  const { title, agree, neutral, disagree, desc = '', imageName = [] } = req.body;
  console.log('createPost>>>', createPost);

  const user = res.locals.user;

  try {
    const post = new Post();
    post.title = title;
    post.agree = agree;
    post.neutral = neutral;
    post.disagree = disagree;
    post.desc = desc;
    post.images = imageName;
    post.username = user;

    await post.save();

    // 이미지 업로드 및 게시물에 연결
    console.log('imagePath>>>', imageName);

    if (imageName.length > 0) {
      const images = [];
      for (const file of imageName) {
        const image = new Image();
        image.src = file;
        image.post = post;
        await image.save();
        images.push(image);
      }

      for (const image of images) {
        post.images = image.id;
      }
    }

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 3) as number;

  console.log('req.query.page...', req.query.page);

  try {
    const allPosts = await Post.find({
      order: { createdAt: 'DESC' },
      // relations: ['votes', 'comments'],
      relations: ['votes', 'comments', 'images', 'user.image'],
      // 'comments.user.image',
      skip: currentPage * perPage,
      take: perPage,
    });

    // if (res.locals.user) {
    //   allPosts.forEach((p) => p.setUserVote(res.locals.user));
    // }

    return res.json(allPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

const getDetailPost = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  console.log('req.params>>>', req.params);

  try {
    const post = await Post.findOneOrFail({
      where: { identifier },
      relations: ['votes', 'images', 'user.image'],

      // 'comments.user.image',
      // 'comments',
      // 'images',
    });

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

const getOwnPosts = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  try {
    const user: User = res.locals.user;
    console.log('user>>>', user);

    const ownPosts = await Post.find({
      where: { username: identifier },
      order: { createdAt: 'DESC' },
      relations: ['votes', 'comments', 'images'],
    });
    console.log('ownPosts>>>', ownPosts);

    return res.json(ownPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

router.get('/', getAllPosts);
router.get('/owned/:identifier', userMiddleware, authMiddleware, getOwnPosts);
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
router.get('/:identifier', getDetailPost);

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

//////////////////////

// const allPosts = await Post.createQueryBuilder('post')
//   .leftJoinAndSelect('post.votes', 'votes')
//   .leftJoinAndSelect('post.images', 'images')
//   .leftJoinAndSelect('post.user', 'user')
//   .leftJoinAndSelect('user.image', 'userImage')
//   .leftJoin('post.comments', 'comments')
//   .addSelect((subQuery) => {
//     return subQuery
//       .select('*')
//       .from('comments', 'sub_comments')
//       .where('post.id = sub_comments.postId')
//       .orderBy('sub_comments.createdAt', 'DESC')
//       .limit(5);
//   }, 'comments')
//   .orderBy('post.createdAt', 'DESC')
//   .getMany();

// const allPosts = await Post.createQueryBuilder('post')
//   .leftJoinAndSelect('post.votes', 'votes')
//   .leftJoinAndSelect('post.images', 'images')
//   .leftJoinAndSelect('post.user', 'user')
//   .leftJoinAndSelect('user.image', 'userImage')
//   .leftJoinAndSelect('post.comments', 'comments')
//   .orderBy('post.createdAt', 'DESC')
//   .addOrderBy('comments.createdAt', 'DESC')
//   .getMany();

// // 각 게시물에 대해 댓글을 최대 5개로 제한합니다.
// allPosts.forEach((post) => {
//   if (post.comments.length > 5) {
//     post.comments.length = 5;
//   }
// });
