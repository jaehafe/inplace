import { Request, Response, Router } from 'express';
import Post from '../entities/Post';
import PostVote from '../entities/PostVote';
import User from '../entities/User';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userMiddleware } from '../middlewares/userMiddleware';

const router = Router();

const handlePostVote = async (req: Request, res: Response) => {
  const { value } = req.body;
  // console.log('postVotes value!!!!!!!!', value);
  const { identifier } = req.params;

  if (!['agree', 'neutral', 'disagree'].includes(value)) {
    return res.status(400).json({ value: 'agree, neutral, disagree value만 올 수 있습니다.' });
  }

  try {
    const user: User = res.locals.user;
    let post: Post = await Post.findOneByOrFail({ identifier });
    let postVote: PostVote | undefined;

    postVote = await PostVote.findOne({ where: { postId: post.id, username: user.username } });

    // 투표를 한 사용자가 없으면 새로운 PostVote 인스턴스 생성
    if (!postVote) {
      postVote = new PostVote();
      postVote.post = post;
      postVote.user = user;
    } else {
      // 투표를 한 사용자가 있다면 기존에 투표한 값을 0으로 초기화
      postVote.agree = 0;
      postVote.neutral = 0;
      postVote.disagree = 0;
    }

    // 새로운 투표 값을 설정하고 저장함
    postVote[value] = 1;
    await postVote.save();

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
