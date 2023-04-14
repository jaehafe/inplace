import { Entity, Index, Column, ManyToOne, JoinColumn, OneToMany, BeforeInsert } from 'typeorm';
import BaseEntity from './Entity';
import User from './User';
import Place from './Place';
import Vote from './Vote';
import Comment from './Comment';
import { Exclude, Expose } from 'class-transformer';
import { makeId, slugify } from '../utils/helper';
import Image from './Image';
import PostVote from './PostVote';

@Entity('posts')
export default class Post extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Column({ type: 'text' })
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: 'text' })
  desc: string;

  @Column({ nullable: true })
  placeName: string;

  @Column()
  username: string;

  @OneToMany(() => Image, (image) => image.post)
  @JoinColumn({ name: 'id', referencedColumnName: 'postId' })
  images: Image[];

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @ManyToOne(() => Place, (place) => place.posts)
  @JoinColumn({ name: 'placeName', referencedColumnName: 'name' })
  place: Place;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostVote, (vote) => vote.post)
  votes: PostVote[];

  @Column({ type: 'varchar', length: 30 })
  upVote: string;

  @Column({ type: 'varchar', length: 30 })
  neutralVote: string;

  @Column({ type: 'varchar', length: 30 })
  downVote: string;

  @Expose() get url(): string {
    return `/${this.placeName}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((memo, curt) => memo + (curt.value || 0), 0);
  }

  protected userVote: number;

  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
