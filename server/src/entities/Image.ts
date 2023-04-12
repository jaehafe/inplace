import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import BaseEntity from './Entity';
import Post from './Post';

@Entity('images')
export default class Image extends BaseEntity {
  @Column({ nullable: true })
  src: string;

  @ManyToOne(() => Post, (post) => post.images)
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: Post;
}
