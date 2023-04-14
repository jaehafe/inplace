import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from './Entity';
import Post from './Post';
import User from './User';

@Entity('post_votes')
export default class PostVote extends BaseEntity {
  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column()
  username: string;

  @ManyToOne(() => Post, (post) => post.votes)
  post: Post;

  @Column()
  postId: number;

  @Column({ nullable: true })
  placeId: number;

  @Column({ nullable: true })
  commentId: number;

  setValue(user: User, value: number) {
    this.value = value;
    this.user = user;
  }
}
