import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './Category';
import Post from './Post';

@Entity('post_categories')
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.categories)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => Category, (category) => category.postCategories)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
