import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Comment from './Comment';
import BaseEntity from './Entity';
import User from './User';

@Entity('comment_votes')
export default class CommentVote extends BaseEntity {
  @Column()
  value: number;

  // username -> user id 수정함.
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column()
  userId: number;

  @Column({ nullable: true })
  commentId: number;

  @ManyToOne(() => Comment, (comment) => comment.commentVotes)
  comment: Comment;

  // @ManyToOne(() => Comment)
  // comment: Comment;
}
