import { Entity, Index, Column, ManyToOne, JoinColumn, OneToMany, BeforeInsert, ManyToMany, JoinTable } from 'typeorm';
import BaseEntity from './Entity';
import User from './User';
import Place from './Place';
import Comment from './Comment';
import { Exclude, Expose } from 'class-transformer';
import { makeId, slugify } from '../utils/helper';
import Image from './Image';
import PostVote from './PostVote';
import Category from './Category';
import PostCategory from './PostCategory';

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

  // @Column()
  // username: string;
  @Column()
  userId: number;

  @OneToMany(() => Image, (image) => image.post)
  @JoinColumn({ name: 'id', referencedColumnName: 'postId' })
  images: Image[];

  // @ManyToOne(() => User, (user) => user.posts)
  // @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  // user: User;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Place, (place) => place.posts)
  @JoinColumn({ name: 'placeName', referencedColumnName: 'name' })
  place: Place;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostVote, (vote) => vote.post)
  votes: PostVote[];

  @Column({ type: 'varchar', length: 30 })
  agree: string;

  @Column({ type: 'varchar', length: 30 })
  neutral: string;

  @Column({ type: 'varchar', length: 30 })
  disagree: string;

  // @Column()
  // views: number;

  @OneToMany(() => PostCategory, (postCategory) => postCategory.post)
  categories: PostCategory[];

  @Expose() get url(): string {
    return `/${this.placeName}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((memo, curt) => memo + (curt.agree + curt.neutral + curt.disagree), 0);
  }

  @Expose() get agreeScore(): number {
    return this.votes?.reduce((memo, curt) => memo + curt.agree, 0);
  }

  @Expose() get neutralScore(): number {
    return this.votes?.reduce((memo, curt) => memo + curt.neutral, 0);
  }

  @Expose() get disagreeScore(): number {
    return this.votes?.reduce((memo, curt) => memo + curt.disagree, 0);
  }

  protected userVote: 'agree' | 'neutral' | 'disagree' | null;

  @Expose()
  get getUserVote(): 'agree' | 'neutral' | 'disagree' | null {
    return this.userVote;
  }

  setUserVote(user: User) {
    const vote = this.votes?.find((v) => v.userId === user.id);
    if (vote) {
      this.userVote = vote.agree > 0 ? 'agree' : vote.neutral > 0 ? 'neutral' : 'disagree';
    } else {
      this.userVote = null;
    }
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
