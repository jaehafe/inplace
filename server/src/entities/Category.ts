import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Post from './Post';
import PostCategory from './PostCategory';
import BaseEntity from '../entities/Entity';

@Entity('categories')
export default class Category extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => PostCategory, (postCategory) => postCategory.category)
  postCategories: PostCategory[];
}
