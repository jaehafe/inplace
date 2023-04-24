import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Category from './Category';
import Post from './Post';
import BaseEntity from '../entities/Entity';

@Entity('post_categories')
export default class PostCategory extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.categories)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => Category, (category) => category.postCategories)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
