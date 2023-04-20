import { Request, Response, Router } from 'express';
import Follow from '../entities/Follow';
import User from '../entities/User';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userMiddleware } from '../middlewares/userMiddleware';

const router = Router();

const getFollowers = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 3) as number;
  const { username } = req.params;
  // console.log('username>>>', username);

  // console.log('req.query.page...', req.query.page);

  const loggedInUser = res.locals.user;

  try {
    const targetUser = await User.findOneOrFail({ where: { username } });
    const followers = await Follow.find({
      where: { followingId: targetUser.id },
      relations: ['follower', 'follower.image'],
      skip: currentPage * perPage,
      take: perPage,
    });

    if (loggedInUser) {
      for (let i = 0; i < followers.length; i++) {
        const isFollowing = await Follow.findOne({
          where: {
            followerId: loggedInUser.id,
            followingId: followers[i].followerId,
          },
        });

        followers[i].isFollowing = Boolean(isFollowing);
      }
    }

    return res.json(followers);
  } catch (error) {
    console.error(error);
    return res.json({ error: 'something went wrong' });
  }
};

const getFollowings = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 3) as number;
  const { username } = req.params;
  // console.log('req.query.page...', req.query.page);

  try {
    const targetUser = await User.findOneOrFail({ where: { username } });
    const followers = await Follow.find({
      where: { followerId: targetUser.id },
      relations: ['following', 'following.image'],
      skip: currentPage * perPage,
      take: perPage,
    });
    return res.json(followers);
  } catch (error) {
    console.error(error);
    return res.json({ error: 'something went wrong' });
  }
};

const handleFollow = async (req: Request, res: Response) => {
  const { id: userId } = req.body;
  const user: User = res.locals.user;

  try {
    if (user.id === Number(userId)) {
      return res.status(400).json({ error: '자신을 팔로우하거나 언팔로우할 수 없습니다.' });
    }

    const targetUser = await User.findOneOrFail({ where: { id: userId } });
    console.log('targetUser>>>', targetUser);

    // 이미 팔로우 중인지 확인
    const follow = await Follow.findOne({ where: { followerId: user.id, followingId: targetUser.id } });

    if (follow) {
      // 이미 팔로우한 경우, 팔로우를 취소하고 DB에서 삭제
      await follow.remove();
      res.status(200).json({ message: '팔로우 취소' });
    } else {
      // 아직 팔로우하지 않은 경우, 팔로우 추가
      const newFollow = new Follow();
      newFollow.follower = user;
      newFollow.following = targetUser;
      await newFollow.save();
      res.status(200).json({ message: '팔로우 추가' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

router.get('/:username/followers', userMiddleware, getFollowers);
router.get('/:username/followings', getFollowings);
router.post('/', userMiddleware, authMiddleware, handleFollow);

export default router;
