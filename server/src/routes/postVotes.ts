import { Request, Response, Router } from 'express';
import Post from '../entities/Post';
import PostVote from '../entities/PostVote';
import User from '../entities/User';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userMiddleware } from '../middlewares/userMiddleware';

const router = Router();

const handlePostVote = async (req: Request, res: Response) => {
  const { value } = req.body;
  const { identifier } = req.params;
  console.log('identifier>>>', identifier);
  console.log('value>>>', value);

  if (!['agree', 'neutral', 'disagree'].includes(value)) {
    return res.status(400).json({ value: 'agree, neutral, disagree value만 올 수 있습니다.' });
  }

  try {
    const user: User = res.locals.user;
    let post: Post = await Post.findOneByOrFail({ identifier });
    let postVote: PostVote | undefined;
    let comment: Comment;

    // 해당 value에 따라 칼럼 값을 증가시킴
    switch (value) {
      case 'agree':
        post.agree += 1;
        break;
      case 'neutral':
        post.neutral += 1;
        break;
      case 'disagree':
        post.disagree += 1;
        break;
    }

    // 이미 투표한 사용자인지 확인하고 새로운 투표 정보를 생성하거나 업데이트함
    postVote = await PostVote.findOne({ where: { postId: post.id, username: user.username } });
    if (!postVote) {
      postVote = new PostVote();
      postVote.post = post;
      postVote.user = user;
    }
    postVote.value = 1;
    await postVote.save();

    // 투표 정보와 관련된 칼럼 값을 업데이트하고 저장함
    await post.save();

    // 사용자가 투표한 정보를 업데이트함
    post.setUserVote(user);

    const { voteScore } = post;

    return res.json({ voteScore });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

router.post('/:identifier', userMiddleware, authMiddleware, handlePostVote);

export default router;
