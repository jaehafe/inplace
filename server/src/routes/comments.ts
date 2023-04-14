import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userMiddleware } from '../middlewares/userMiddleware';
import Comment from '../entities/Comment';
import Post from '../entities/Post';
import { getConnection } from 'typeorm';
import { AppDataSource } from '../data-source';

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

    // 댓글이 없을 경우 메시지
    // const totalComments = await Comment.count({ where: { postId: post.id } });
    // if (totalComments === 0) {
    //   return res.json({ message: '댓글이 없습니다.' });
    // }
    //

    const comments = await Comment.find({
      where: { postId: post.id },
      order: { createdAt: 'DESC' },
      relations: ['commentVotes'],
    });

    // if (res.locals.user) {
    //   comments.forEach((c) => c.setUserVote(res.locals.user));
    // }
    console.log('comments>>', comments);

    return res.json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '댓글을 찾을 수 없습니다.' });
  }
};

const updateComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const { body } = req.body;
  console.log('identifier>>>', identifier);

  console.log('req.body>>>', req.body);

  // console.log('commentbody>>>', body);

  const user = res.locals.user;

  try {
    const comment = await Comment.findOneOrFail({ where: { identifier }, relations: ['post'] });

    if (comment.username !== user.username) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // await Comment.update({ identifier }, { body });

    // // comment.body = body;
    // return res.json(comment);
    /////////////////////
    await AppDataSource.createQueryBuilder()
      .update(Comment)
      .set({ body })
      .where('identifier = :identifier', { identifier })
      .execute();

    const updatedComment = await Comment.findOneOrFail({ where: { identifier }, relations: ['post'] });
    console.log('result>>', updatedComment);

    return res.json(updatedComment);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: 'Comment not found' });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const user = res.locals.user;

  try {
    const comment = await Comment.findOneOrFail({ where: { identifier }, relations: ['post'] });

    if (comment.username !== user.username) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await Comment.delete({ identifier });
    return res.json({ message: '댓글 삭제 완료' });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: 'Comment not found' });
  }
};

router.get('/:identifier', userMiddleware, getPostComments);
router.post('/:identifier', userMiddleware, createPostComment);
router.patch('/:identifier', userMiddleware, authMiddleware, updateComment);
router.delete('/:identifier', userMiddleware, authMiddleware, deleteComment);

export default router;

// router.get('/:identifier/comments', userMiddleware, getPostComments);
// router.post('/:identifier/comments', userMiddleware, createPostComment);