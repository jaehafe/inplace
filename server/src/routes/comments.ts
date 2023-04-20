import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userMiddleware } from '../middlewares/userMiddleware';
import Comment from '../entities/Comment';
import Post from '../entities/Post';
import { AppDataSource } from '../data-source';
import CommentVote from '../entities/CommentVote';
import User from '../entities/User';

const router = Router();

const createPostComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const { body } = req.body;

  try {
    const post = await Post.findOneByOrFail({ identifier });
    const comment = new Comment();
    comment.body = body;
    comment.user = res.locals.user;
    comment.userId = res.locals.user.id;
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
      relations: ['commentVotes', 'user', 'user.image'],
      // relations: ['commentVotes', 'user'],
    });

    return res.json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '댓글을 찾을 수 없습니다.' });
  }
};

const getOwnComments = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 3) as number;

  const { identifier } = req.params;

  try {
    // const comments = await Comment.find({
    //   where: { username: identifier },
    //   order: { createdAt: 'DESC' },
    //   relations: ['post', 'post.user', 'post.user.image', 'user.image'],
    //   skip: currentPage * perPage,
    //   take: perPage,
    // });

    // return res.json(comments);
    const user = await User.findOneOrFail({ where: { username: identifier } });
    const [comments, total] = await Comment.createQueryBuilder('comment')
      // .where('post.userId = :userId', { userId: user.id })
      .where('comment.userId = :userId', { userId: user.id })
      .orderBy('comment.createdAt', 'DESC')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('post.user', 'postUser')
      .leftJoinAndSelect('postUser.image', 'postUserImage')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('user.image', 'userImage')
      .skip(currentPage * perPage)
      .take(perPage)
      .getManyAndCount();

    return res.json({ data: comments, total });
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

    if (comment.userId !== user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await AppDataSource.createQueryBuilder()
      .update(Comment)
      .set({ body })
      .where('identifier = :identifier', { identifier })
      .execute();

    const updatedComment = await Comment.findOneOrFail({ where: { identifier }, relations: ['post'] });

    return res.json(updatedComment);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: 'Comment not found' });
  }
};

// const deleteComment = async (req: Request, res: Response) => {
//   const { identifier } = req.params;
//   const user = res.locals.user;

//   try {
//     const comment = await Comment.findOneOrFail({ where: { identifier }, relations: ['post'] });

//     if (comment.username !== user.username) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     await Comment.delete({ identifier });
//     return res.json({ message: '댓글 삭제 완료' });
//   } catch (error) {
//     console.error(error);
//     return res.status(404).json({ error: 'Comment not found' });
//   }
// };

// 좋아요가 표시된 댓글은 먼저 해당 댓글의 좋아요 기록을 지우고 해당 댓글을 삭제
const deleteComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const user = res.locals.user;

  try {
    const comment = await Comment.findOneOrFail({ where: { identifier }, relations: ['post', 'commentVotes'] });

    if (comment.userId !== user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 댓글과 관련된 comment_votes 레코드를 먼저 삭제
    const promises = comment.commentVotes.map((commentVote) => CommentVote.delete(commentVote.id));
    await Promise.all(promises);

    await Comment.delete({ identifier });
    return res.json({ message: '댓글 삭제 완료' });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: 'Comment not found' });
  }
};

router.get('/owned/:identifier', getOwnComments);
router.get('/:identifier', userMiddleware, getPostComments);
router.post('/:identifier', userMiddleware, createPostComment);
router.patch('/:identifier', userMiddleware, authMiddleware, updateComment);
router.delete('/:identifier', userMiddleware, authMiddleware, deleteComment);

export default router;

// router.get('/:identifier/comments', userMiddleware, getPostComments);
// router.post('/:identifier/comments', userMiddleware, createPostComment);
