import { Expose } from 'class-transformer';
import BaseEntity from './Entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import User from './User';
import Post from './Post';

@Entity('places')
export default class Place extends BaseEntity {
  @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  // name: 외래키 속성명, Place의 username, name이 없다면 propertyName + referencedColumnName이 default
  // referencedColumnName: 참조 **entity(User)의 참조 속성명(username), 없으면 id가 default값
  // 둘 다 없으면 FK필드는 FK속성명 + Id (user_id)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @OneToMany(() => Post, (post) => post.place)
  posts: Post[];

  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `${process.env.APP_URL}/images/${this.imageUrn}`
      : 'https://www.gravatar.com/avatar?d=mp&f=y';
  }

  @Expose()
  get bannerUrl(): string {
    return this.bannerUrn ? `${process.env.APP_URL}/images/${this.bannerUrn}` : undefined;
  }
}

/**
 * @JoinColumn
 * 어떤 관계 쪽이 외래키를 가지고 있는지 나타냄
 * @ManyToOne 선택사항, @OneToOne은 필수
 *
 * name 속성은 현재 엔티티(Place)에서 사용될 외래키 컬럼의 이름을 지정.
 * referencedColumnName 속성은 연결되는 엔티티(User)에서 사용될 컬럼의 이름을 지정.
 */

/**
 * @Expose
 * 데코레이터를 사용하여 원하는 프로퍼티만 노출시킬 수 있다.
 */

/**
 * @외래키
 * 외래키는 두 테이블을 서로 연결하는 데 사용되는 키
 * 외래키가 포함된 테이블을 자식 테이블이라고 하고 외래키 값을 제공하는 테이블을 부모 테이블
 *
 */
