import { Request, Response, Router } from 'express';
import User from '../entities/User';

const router = Router();

// 개별 유저 정보
const getUserInfo = async (req: Request, res: Response) => {
  console.log('req.params>>>', req.params);

  const { identifier } = req.params;

  try {
    const userInfo = await User.findOne({
      where: { username: identifier },
      relations: ['image'],
    });
    if (!userInfo) {
      return res.status(404).json({ error: '유저를 찾을 수 없습니다.' });
    }

    return res.json(userInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

router.get('/:identifier', getUserInfo);

export default router;
