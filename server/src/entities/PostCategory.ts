import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './Category';
import Post from './Post';

@Entity('post_categories')
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post)
  @JoinColumn()
  post: Post;

  @ManyToOne(() => Category)
  @JoinColumn()
  category: Category;
}
