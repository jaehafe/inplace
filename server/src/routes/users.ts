import { Request, Response, Router } from 'express';
import { AppDataSource } from '../data-source';
import Follow from '../entities/Follow';
import User from '../entities/User';
import { userMiddleware } from '../middlewares/userMiddleware';

const router = Router();

// 개별 유저 정보
const getUserInfo = async (req: Request, res: Response) => {
  console.log('req.params>>>', req.params);
  const loggedInUser = res.locals.user;

  const { identifier } = req.params;

  try {
    // const userInfo = await User.findOne({
    //   where: { username: identifier },
    //   relations: ['image'],
    // });
    const userInfo = await User.createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.username', 'user.imageId'])
      .leftJoinAndSelect('user.image', 'image')
      .where('user.username = :identifier', { identifier })
      .getOne();

    if (!userInfo) {
      return res.json({ error: '유저를 찾을 수 없습니다.' });
    }

    const followersCount = await AppDataSource.createQueryBuilder()
      .select('COUNT(follow.id)', 'count')
      .from(Follow, 'follow')
      .where('follow.followingId = :userId', { userId: userInfo.id })
      .getRawOne();

    const followingCount = await AppDataSource.createQueryBuilder()
      .select('COUNT(follow.id)', 'count')
      .from(Follow, 'follow')
      .where('follow.followerId = :userId', { userId: userInfo.id })
      .getRawOne();

    if (!loggedInUser) {
      return res.json({
        ...userInfo,
        followersCount: parseInt(followersCount.count),
        followingCount: parseInt(followingCount.count),
      });
    }

    const isFollowing = await Follow.findOne({
      where: {
        followerId: loggedInUser.id,
        followingId: userInfo.id,
      },
    });

    const result = {
      ...userInfo,
      followersCount: parseInt(followersCount.count),
      followingCount: parseInt(followingCount.count),
      isFollowing: Boolean(isFollowing),
    };

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

router.get('/:identifier', userMiddleware, getUserInfo);

export default router;
