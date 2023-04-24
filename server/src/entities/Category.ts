import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Post from './Post';
import PostCategory from './PostCategory';

@Entity('categories')
export default class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => PostCategory, (postCategory) => postCategory.category)
  postCategories: PostCategory[];
}
