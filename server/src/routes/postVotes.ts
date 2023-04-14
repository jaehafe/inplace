import { Request, Response, Router } from 'express';
import Post from '../entities/Post';
import PostVote from '../entities/PostVote';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

const handlePostVote = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const { value } = req.body;

  try {
    const user = res.locals.user;

    const post = await Post.findOneBy({ identifier });
    if (!post) throw new Error('Post not found');

    const voteValue = 1;

    let postVote = await PostVote.findOne({ where: { postId: post.id, username: user.username } });
    if (!postVote) {
      const postVote = new PostVote();
      postVote.post = post;
      postVote.user = user;
    }

    postVote.value = voteValue;
    await postVote.save();

    post.setUserVote(user);

    const { voteScore } = post;

    return res.json({ voteScore });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

router.post('/:identifier', authMiddleware, handlePostVote);

export default router;
