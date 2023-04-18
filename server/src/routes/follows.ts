import { Request, Response, Router } from 'express';
import Follow from '../entities/Follow';
import User from '../entities/User';
import { authMiddleware } from '../middlewares/authMiddleware';
import { userMiddleware } from '../middlewares/userMiddleware';

const router = Router();

const getFollowers = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const targetUser = await User.findOneOrFail({ where: { username } });
    const followers = await Follow.find({
      where: { followingId: targetUser.id },
      relations: ['follower'],
    });
    return res.json(followers);
  } catch (error) {
    console.error(error);
    return res.json({ error: 'something went wrong' });
  }
};

const getFollowings = async (req: Request, res: Response) => {};

const addFollow = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const { username } = req.body;
  console.log('username>>>', username);
  console.log('req.params>>>', req.params);

  try {
    const targetUser = await User.findOneOrFail({ where: { username } });

    // 이미 팔로우 중인지 확인
    const isFollowing = await Follow.findOne({
      where: { followerId: user.id, followingId: targetUser.id },
    });

    if (isFollowing) {
      return res.status(400).json({ error: '이미 팔로우 중입니다.' });
    }

    // 팔로우 추가
    const follow = new Follow();
    follow.follower = user;
    follow.following = targetUser;
    await follow.save();

    return res.json({ message: '팔로우 추가 성공' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

const deleteFollow = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const { username } = req.body;
  console.log('req.params>>>', req.params);

  try {
    const targetUser = await User.findOneOrFail({ where: { username } });
    // 이미 팔로우 중인지 확인
    const isFollowing = await Follow.findOne({
      where: { followerId: user.id, followingId: targetUser.id },
    });

    if (isFollowing) {
      await Follow.delete({ followingId: targetUser.id });
    }
    return res.json({ success: '팔로워 삭제 완료' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

const handleFollow = async (req: Request, res: Response) => {
  const { username } = req.body;

  try {
    const user: User = res.locals.user;
    const targetUser = await User.findOneOrFail({ where: { username } });

    // 이미 팔로우 중인지 확인
    const follow = await Follow.findOne({ where: { followerId: user.id, followingId: targetUser.id } });
    console.log('팔로우 중인지 확인!!!!!!!!!!', follow);

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

router.get('/:username/followers', getFollowers);
router.get('/:username/followings', getFollowings);
router.post('/:username', userMiddleware, authMiddleware, handleFollow);
// router.post('/:username', userMiddleware, authMiddleware, addFollow);
router.delete('/:username', userMiddleware, authMiddleware, deleteFollow);

export default router;

// 팔로우 추가: POST /api/follows/:username
// 팔로우 삭제: DELETE /api/follows/:username
// 팔로잉 목록 조회: GET /api/follows/following/:username
// 팔로워 목록 조회: GET /api/follows/followers/:username
