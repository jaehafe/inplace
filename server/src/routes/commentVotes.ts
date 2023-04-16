import { Request, Response, Router } from 'express';
import Comment from '../entities/Comment';
import CommentVote from '../entities/CommentVote';
import User from '../entities/User';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userMiddleware } from '../middlewares/userMiddleware';

const router = Router();

const handleCommentVote = async (req: Request, res: Response) => {
  const { value } = req.body;
  const { identifier } = req.params;

  try {
    const user: User = res.locals.user;
    // comment 가져오기
    const comment = await Comment.findOneByOrFail({ identifier });

    // 해당 comment의 vote를 이미 했는지 안 했는지 확인
    const commentVote = await CommentVote.findOne({ where: { username: user.username, commentId: comment.id } });

    // 투표를 했지만 내가 투표하는 값이랑 다를때 (내가 이미 투표했을 때)
    if (commentVote) {
      if (commentVote.value !== value) {
        commentVote.value = value;
        await commentVote.save();
      } else {
        // 이미 투표한 값이 같을 때, 투표를 취소하고 DB에서 삭제
        await commentVote.remove();
      }
    } else {
      // 아직 내가 해당 댓글에 투표하지 않은 경우
      const newVote = new CommentVote();
      newVote.user = user;
      newVote.comment = comment;
      newVote.value = value;
      await newVote.save();
    }

    comment.setUserVote(user);
    await comment.save();
    return res.json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

router.post('/:identifier', userMiddleware, authMiddleware, handleCommentVote);

export default router;
