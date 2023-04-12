// const vote = async (req: Request, res: Response) => {
//   const { postId, voteType } = req.body;

//   try {
//     const post = await Post.findOneOrFail(postId);

//     const vote = post.votes[0];

//     if (voteType === 'upVote') {
//       vote.upVote += 1;
//     } else if (voteType === 'neutralVote') {
//       vote.neutralVote += 1;
//     } else if (voteType === 'downVote') {
//       vote.downVote += 1;
//     }

//     await post.save();
//     res.json(post);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'something went wrong' });
//   }
// };
// 이렇게 하면 클라이언트에서는 Votes 배열에 있는 각 투표에 대한

// Jaeha Adam Lee
//   @Column('simple-json') 이건 뭐지?

// @Column('simple-json')은 TypeORM에서 지원하는 데이터 타입 중 하나로, JSON 문자열을 DB 컬럼에 저장할 때 사용하는 타입입니다. 이 컬럼에서는 JSON 데이터를 문자열로 저장하고, 저장된 JSON 문자열을 JS 객체로 변환하여 사용할 수 있습니다.

// JSON 형태로 저장된 컬럼을 사용하면, JS 객체나 배열 등과 같은 복잡한 데이터를 쉽게 저장하고 조회할 수 있습니다. 예를 들어, Post 엔티티에서 votes 속성을 @Column('simple-json')으로 선언하면, 해당 속성에 JSON 데이터를 저장할 수 있습니다.

// typescript
// Copy code
// @Entity()
// export class Post {
//   // ...

//   @Column('simple-json')
//   votes: {
//     upVote: string;
//     neutralVote: string;
//     downVote: string;
//   }[];
// }
// 위의 코드에서는 votes 속성에 {upVote, neutralVote, downVote}를 가지는 객체들의 배열을 저장할 수 있습니다.

// 이렇게 JSON 형태로 저장된 컬럼에서 데이터를 사용할 때는, 저장된 JSON 문자열을 JS 객체나 배열로 변환하는 과정이 필요합니다. 이는 JSON.parse() 함수를 사용하면 간단히 처리할 수 있습니다. 아래의 코드는 TypeORM에서 Post 엔티티에서 votes 속성을 불러와서 JS 객체로 변환하는 예시입니다.

// typescript
// Copy code
// const post = await Post.findOneOrFail(id);
// const votes = post.votes.map(JSON.parse);
// 이렇게 하면 votes 배열에 있는 JSON 문자열들이 JS 객체로 변환됩니다.
