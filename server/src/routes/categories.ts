import { Request, Response, Router } from 'express';
import Category from '../entities/Category';
import Post from '../entities/Post';

const router = Router();

const getCategories = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 4) as number;
  const { category: categoryId } = req.params;

  try {
    const category = await Category.find({ where: { id: Number(categoryId) } });

    if (!category) {
      return res.status(404).json({ error: '카테고리를 찾을 수 없습니다.' });
    }

    const [posts, total] = await Post.createQueryBuilder('post')
      .innerJoin('post.categories', 'postCategory')
      .innerJoin('postCategory.category', 'category')
      .where('category.id = :categoryId', { categoryId })
      .orderBy('post.createdAt', 'DESC')
      .leftJoinAndSelect('post.votes', 'votes')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.images', 'images')
      .leftJoinAndSelect('post.categories', 'postCategories')
      .leftJoinAndSelect('postCategories.category', 'categoryData')
      .skip(currentPage * perPage)
      .take(perPage)
      .getManyAndCount();

    return res.json({ data: posts, total, name: category[0].name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};

router.get('/:category', getCategories);

export default router;
