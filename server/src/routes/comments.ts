import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userMiddleware } from '../middlewares/userMiddleware';
import Comment from '../entities/Comment';
import Post from '../entities/Post';

const router = Router();

const createPostComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const { body } = req.body;

  try {
    const post = await Post.findOneByOrFail({ identifier });
    const comment = new Comment();
    comment.body = body;
    comment.user = res.locals.user;
    comment.post = post;

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }

    await comment.save();
    return res.json(comment);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
  }
};

const getPostComments = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  try {
    const post = await Post.findOneByOrFail({ identifier });
    const comments = await Comment.find({
      where: { postId: post.id },
      order: { createdAt: 'DESC' },
      relations: ['votes'],
    });

    if (res.locals.user) {
      comments.forEach((c) => c.setUserVote(res.locals.user));
    }
    return res.json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '댓글을 찾을 수 없습니다.' });
  }
};

const updateComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const { body } = req.body;
  const user = res.locals.user;

  try {
    const comment = await Comment.findOneOrFail({ where: { identifier }, relations: ['post'] });

    if (comment.username !== user.username) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await Comment.update({ identifier }, { body });

    comment.body = body;
    return res.json(comment);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: 'Comment not found' });
  }
};

// router.get('/:identifier/comments', userMiddleware, getPostComments);
// router.post('/:identifier/comments', userMiddleware, createPostComment);

router.get('/:identifier', userMiddleware, getPostComments);
router.post('/:identifier', userMiddleware, createPostComment);
router.patch('/:identifier', authMiddleware, userMiddleware, updateComment);

export default router;
