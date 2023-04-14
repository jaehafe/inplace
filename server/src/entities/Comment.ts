import { Exclude, Expose } from 'class-transformer';
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { makeId } from '../utils/helper';
import CommentVote from './CommentVote';
import BaseEntity from './Entity';
import Post from './Post';
import User from './User';

@Entity('comments')
export default class Comment extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column()
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;

  @OneToMany(() => CommentVote, (commentVote) => commentVote.comment)
  commentVotes: CommentVote[];

  // @Exclude()
  // @OneToMany(() => Vote, (Vote) => Vote.comment)
  // votes: Vote[];

  protected userVote: number;

  setUserVote(user: User) {
    const index = this.commentVotes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.commentVotes[index].value : 0;
  }

  @Expose() get voteScore(): number {
    const initialValue = 0;
    return this.commentVotes?.reduce(
      (previousValue, currentObject) => previousValue + (currentObject.value || 0),
      initialValue
    );
  }

  @BeforeInsert()
  makeId() {
    this.identifier = makeId(8);
  }
}

/**
 * @BeforeInsert
 * 데코레이터는 엔티티가 데이터베이스에 저장되기 전에 먼저 실행되는 메서드를 정의할 때 사용.
 * 데이터베이스에 새로운 레코드가 삽입되기 전에 호출되며, 엔티티의 상태를 변경할 수 있다.
 */
