import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Comment from './Comment';
import BaseEntity from './Entity';
import User from './User';

@Entity('comment_votes')
export default class CommentVote extends BaseEntity {
  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column()
  username: string;

  @Column({ nullable: true })
  commentId: number;

  @ManyToOne(() => Comment, (comment) => comment.commentVotes)
  comment: Comment;

  // @ManyToOne(() => Comment)
  // comment: Comment;
}
