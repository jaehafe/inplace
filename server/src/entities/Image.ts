import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import BaseEntity from './Entity';
import Post from './Post';
import User from './User';

@Entity('images')
export default class Image extends BaseEntity {
  @Column({ nullable: true })
  src: string;

  @ManyToOne(() => Post, (post) => post.images, { nullable: true })
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: Post;

  @OneToOne(() => User, (user) => user.image, { nullable: true })
  @JoinColumn({ name: 'imageId' })
  profileImg: User;
}
