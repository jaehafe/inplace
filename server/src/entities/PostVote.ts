import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from './Entity';
import Post from './Post';
import User from './User';

@Entity('post_votes')
export default class PostVote extends BaseEntity {
  @Column({ default: 0 })
  agree: number;

  @Column({ default: 0 })
  neutral: number;

  @Column({ default: 0 })
  disagree: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Post, (post) => post.votes)
  post: Post;

  @Column()
  postId: number;

  @Column({ nullable: true })
  placeId: number;

  @Column({ nullable: true })
  commentId: number;

  setValue(user: User, value: 'agree' | 'neutral' | 'disagree') {
    this[value] += 1;
    this.user = user;
  }
}
