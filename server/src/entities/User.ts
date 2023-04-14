import { IsEmail, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, BeforeInsert, OneToOne, JoinColumn } from 'typeorm';
import BaseEntity from './Entity';
import bcrypt from 'bcryptjs';
import Post from './Post';
import PostVote from './PostVote';
import CommentVote from './CommentVote';

// 명시적으로 매핑할 테이블을 지정
// 'users'라는 이름을 사용하여 User 엔티티가 users 테이블과 매핑되도록 설정(db에 'users' 이름으로 )
@Entity('users')
export default class User extends BaseEntity {
  // 인덱스는 데이터베이스에서 데이터를 검색할 때 성능을 향상시키는 데 사용
  // @Index()가 두 개인 이유는, email 필드와 username 필드 모두에 인덱스를 생성하도록 설정하기 위함, 빠르게 검색 가능
  // email과 username은 각각 고유한 값이어야 하므로, 이를 강제하기 위해 unique 옵션도 함께 사용
  @Index()
  @IsEmail(undefined, { message: '이메일 주소가 잘못되었습니다.' })
  @Length(1, 255, { message: '이메일 주소는 비워둘 수 없습니다.' })
  @Column()
  email: string;

  @Index()
  @Length(3, 32, { message: '사용자 이름은 3자 이상이어야 합니다.' })
  @Column()
  username: string;

  // @OneToOne(() => UserProfileImage, (userprofile) => userprofile.user)
  // @JoinColumn()
  @Column({ nullable: true })
  imagePath: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: '비밀번호는 6자리 이상이어야 합니다.' })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostVote, (postVote) => postVote.user)
  postVotes: PostVote[];

  @OneToMany(() => CommentVote, (commentVote) => commentVote.user)
  commentVotes: CommentVote[];

  // User 엔티티가 데이터베이스에 삽입되기 전에 해당 엔티티의 password 필드를 bcrypt를 이용하여 해싱하는 작업
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}

/**
 * @OneToMany
 * (typeFunction, inverseSideProperty)
 * typeFunction은 매핑할 다른 엔티티의 클래스 타입을 지정하는 함
 * inverseSideProperty는 연결된 다른 엔티티에서 현재 엔티티와 관련된 역방향 참조를 나타내는 속성 이름을 지정
 */
