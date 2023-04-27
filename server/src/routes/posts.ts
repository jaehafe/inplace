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
import CommentVote from '../entities/CommentVote';
import PostVote from '../entities/PostVote';
import Category from '../entities/Category';
import PostCategory from '../entities/PostCategory';

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
  const { title, agree, neutral, disagree, desc = '', imageName = [], tags } = req.body;

  const user = res.locals.user;

  try {
    const post = new Post();
    post.title = title;
    post.agree = agree;
    post.neutral = neutral;
    post.disagree = disagree;
    post.desc = desc;
    post.images = imageName;
    post.userId = user.id;

    await post.save();

    // 이미지 업로드 및 게시물에 연결

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

    // 태그 생성
    if (tags.length > 0) {
      const tagsArr = [];

      for (const tagName of tags) {
        // 카테고리(태그)가 있는지 db에서 확인
        let category = await AppDataSource.getRepository(Category).findOne({ where: { name: tagName } });

        // 카테고리(태그)가 없으면 새로 셍성
        if (!category) {
          category = new Category();
          category.name = tagName;
          await AppDataSource.getRepository(Category).save(category);
        }

        // PostCategory 연결
        const postCategory = new PostCategory();
        postCategory.post = post;
        postCategory.category = category;
        await AppDataSource.getRepository(PostCategory).save(postCategory);

        tagsArr.push(category);
      }
      post.categories = tagsArr;
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

  try {
    const allPosts = await AppDataSource.createQueryBuilder(Post, 'post')
      .leftJoinAndSelect('post.votes', 'votes')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.images', 'postImages')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('categories.category', 'category')
      .leftJoinAndSelect('user.image', 'userImage')
      .leftJoinAndSelect('user.followers', 'followers')
      .orderBy('post.createdAt', 'DESC')
      .skip(currentPage * perPage)
      .take(perPage)
      .getMany();

    const postIds = allPosts.map((post) => post.id);

    const latestComments = await Promise.all(
      postIds.map(async (postId) => {
        const comments = await AppDataSource.createQueryBuilder(Comment, 'comment')
          .leftJoinAndSelect('comment.user', 'user')
          .leftJoinAndSelect('user.image', 'userImage')
          .where('comment.postId = :postId', { postId })
          .orderBy('comment.createdAt', 'DESC')
          .limit(5)
          .getMany();
        return { postId, comments };
      })
    );

    allPosts.forEach((post) => {
      const postLatestComments = latestComments.find((item) => item.postId === post.id);
      if (postLatestComments) {
        post.comments = postLatestComments.comments;
      }
    });

    return res.json(allPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

const getHotPosts = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 3) as number;

  try {
    const allPosts = await AppDataSource.createQueryBuilder(Post, 'post')
      .leftJoinAndSelect('post.votes', 'votes')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.images', 'postImages')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('categories.category', 'category')
      .leftJoinAndSelect('user.image', 'userImage')
      .leftJoinAndSelect('user.followers', 'followers')
      .orderBy('post.createdAt', 'DESC')
      .skip(currentPage * perPage)
      .take(perPage)
      .getMany();

    const postIds = allPosts.map((post) => post.id);

    const latestComments = await Promise.all(
      postIds.map(async (postId) => {
        const comments = await AppDataSource.createQueryBuilder(Comment, 'comment')
          .leftJoinAndSelect('comment.user', 'user')
          .leftJoinAndSelect('user.image', 'userImage')
          .where('comment.postId = :postId', { postId })
          .orderBy('comment.createdAt', 'DESC')
          .limit(5)
          .getMany();
        return { postId, comments };
      })
    );

    allPosts.forEach((post) => {
      const postLatestComments = latestComments.find((item) => item.postId === post.id);
      if (postLatestComments) {
        post.comments = postLatestComments.comments;
      }
    });

    const postsWithCommentAndVote = allPosts.map((post) => {
      const voteScore = post.votes?.reduce((memo, curt) => memo + (curt.agree + curt.neutral + curt.disagree), 0);
      const commentCount = post.comments?.length ?? 0;

      return {
        ...post,
        voteScore,
        commentCount,
        totalScore: voteScore + commentCount,
      };
    });

    const sortedPosts = postsWithCommentAndVote.sort((a, b) => b.totalScore - a.totalScore);

    return res.json(sortedPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

const getDetailPost = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  try {
    const post = await Post.findOneOrFail({
      where: { identifier },
      relations: ['votes', 'images', 'user.image', 'categories', 'categories.category'],
    });

    // 조회수 증가
    // post.views += 1;
    await post.save();

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

const getVoteResult = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const { identifier } = req.params;

  try {
    const post = await Post.findOneOrFail({
      where: { identifier },
      relations: ['votes', 'votes.post'],
    });

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

const getOwnPosts = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 4) as number;
  const { identifier } = req.params;

  try {
    const user = await User.findOneOrFail({ where: { username: identifier } });

    if (!user) {
      return res.status(404).json({ error: '존재하지 않는 유저입니다.' });
    }

    const [ownPosts, total] = await Post.createQueryBuilder('post')
      .where('post.userId = :userId', { userId: user.id })
      .orderBy('post.createdAt', 'DESC')
      .leftJoinAndSelect('post.votes', 'votes')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.images', 'images')
      .leftJoinAndSelect('post.categories', 'postCategories')
      .leftJoinAndSelect('postCategories.category', 'categoryData')
      .skip(currentPage * perPage)
      .take(perPage)
      .getManyAndCount();

    return res.json({ data: ownPosts, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

const getResponsedPosts = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 4) as number;
  const { identifier } = req.params;

  try {
    const user = await User.findOneOrFail({ where: { username: identifier } });

    if (!user) {
      return res.status(404).json({ error: '존재하지 않는 유저입니다.' });
    }

    const [responsedPosts, total] = await Post.createQueryBuilder('post')
      .leftJoin('post.votes', 'postVote')
      .where('postVote.userId = :userId', { userId: user.id })
      .orderBy('post.createdAt', 'DESC')
      .leftJoinAndSelect('post.votes', 'votes')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.images', 'images')
      .leftJoinAndSelect('post.categories', 'postCategories')
      .leftJoinAndSelect('postCategories.category', 'categoryData')
      .skip(currentPage * perPage)
      .take(perPage)
      .getManyAndCount();

    return res.json({ data: responsedPosts, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

const deletePost = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const user = res.locals.user;

  try {
    const post = await Post.findOneOrFail({
      where: { identifier },
      relations: ['comments', 'images', 'comments.commentVotes', 'votes', 'categories'],
    });

    if (post.userId !== user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 1. commentVotes 삭제
    await Promise.all(post.comments.map((comment) => CommentVote.delete({ commentId: comment.id })));

    // 2. comments 삭제
    await Comment.delete({ postId: post.id });

    // 3. PostVote 삭제
    await PostVote.delete({ postId: post.id });

    // 4. images 삭제
    await Promise.all(post.images.map((image) => Image.delete({ id: image.id })));

    // 5. PostCategory 삭제
    const postCategoryRepository = AppDataSource.getRepository(PostCategory);
    await postCategoryRepository
      .createQueryBuilder()
      .delete()
      .from(PostCategory)
      .where('postId = :postId', { postId: post.id })
      .execute();

    // 6. 마지막으로 post 삭제
    await Post.delete({ identifier });

    return res.json({ message: '게시물 삭제 완료' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

const updatePost = async (req: Request, res: Response) => {
  const {
    title,
    agree,
    neutral,
    disagree,
    desc = '',
    newImageName: imageName = [],
    isImageChanged = false,
    tags,
  } = req.body;

  const { identifier } = req.params;

  try {
    const post = await Post.findOneOrFail({ where: { id: Number(identifier) }, relations: ['images'] });

    if (!post) {
      return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
    }

    if (title) {
      post.title = title;
    }

    if (agree) {
      post.agree = agree;
    }

    if (neutral) {
      post.neutral = neutral;
    }

    if (disagree) {
      post.disagree = disagree;
    }

    if (desc) {
      post.desc = desc;
    }

    if (isImageChanged) {
      if (imageName.length > 0) {
        // 1. 기존 이미지 삭제
        for (const image of post.images) {
          await Image.delete({ id: image.id });
        }

        // 2. 새로운 이미지 업로드 및 게시물과 연결
        const images = [];
        for (const file of imageName) {
          const image = new Image();
          image.src = file;
          image.post = post;
          await image.save();
          images.push(image);
        }

        post.images = images;
      }
    }

    // 3. 카테고리 업데이트
    if (tags) {
      const categoryRepository = AppDataSource.getRepository(Category);
      const postCategoryRepository = AppDataSource.getRepository(PostCategory);

      // 기존 카테고리 찾기
      // const existingPostCategories = await postCategoryRepository.find({ where: { post: post.id } });
      const existingPostCategories = await postCategoryRepository
        .createQueryBuilder('postCategory')
        .innerJoinAndSelect('postCategory.post', 'post', 'post.id = :postId', { postId: post.id })
        .innerJoinAndSelect('postCategory.category', 'category')
        .getMany();

      // 새로운 카테고리를 찾거나 생성
      const newCategories = await Promise.all(
        tags.map(async (tag) => {
          let category = await categoryRepository.findOne({ where: { name: tag } });

          if (!category) {
            category = new Category();
            category.name = tag;
            await category.save();
          }

          return category;
        })
      );

      // 추가해야 할 카테고리 찾기
      const categoriesToAdd = newCategories.filter(
        (newCategory) => !existingPostCategories.some((postCategory) => postCategory.category.id === newCategory.id)
      );

      // 제거해야 할 카테고리 찾기
      const categoriesToRemove = existingPostCategories.filter(
        (postCategory) => !newCategories.some((newCategory) => newCategory.id === postCategory.category.id)
      );

      // 추가해야 할 카테고리 추가
      await Promise.all(
        categoriesToAdd.map(async (categoryToAdd) => {
          const postCategory = new PostCategory();
          postCategory.post = post;
          postCategory.category = categoryToAdd;
          await postCategory.save();
        })
      );

      // 제거해야 할 카테고리 삭제
      await Promise.all(
        categoriesToRemove.map(async (postCategoryToRemove) => {
          await postCategoryRepository.delete(postCategoryToRemove.id);
        })
      );
    }

    await post.save();

    return res.json({ message: '게시물이 업데이트 되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

router.get('/', getAllPosts);
router.get('/hot', getHotPosts);
router.get('/result/:identifier', userMiddleware, getVoteResult);
// userMiddleware, authMiddleware,
router.get('/owned/:identifier', getOwnPosts);
router.get('/responsed/:identifier', getResponsedPosts);
router.get('/:identifier', getDetailPost);
router.post(
  '/images',
  userMiddleware,
  authMiddleware,
  upload.array('postImages'),
  async (req: RequestWithFile, res: Response) => {
    return res.json(req.files.map((file) => file.filename));
  }
);

router.post('/', userMiddleware, authMiddleware, createPost);
router.delete('/:identifier', userMiddleware, authMiddleware, deletePost);
router.patch('/:identifier', userMiddleware, authMiddleware, updatePost);

export default router;
