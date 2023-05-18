## 1. 프로젝트 주제

- 투표기반 SNS
- 개발 기간 4/6 ~ 4/29 (4주)개인 진행

- Github Repo [https://github.com/jaehafe/inplace](https://github.com/jaehafe/inplace)

- 배포 주소 (현재 서버 중단)

## 2. ERD
![inplace erd](https://github.com/jaehafe/inplace/assets/108874515/b9ebea8a-68a2-4a85-96c3-e953c5a2e564)

## 3. 사용한 기술

- 공통 TypeScript v5
- **client**
  - Next.js v13
  - React Query v4
  - Zustand v4
  - antd
  - Styled-components
- **server**
  - Node.js
  - Express
  - TypeORM
  - MySQL
- **deploy**
  - pm2
  - Docker
  - EC2
  - 
## 4. 시연 영상
https://www.youtube.com/watch?v=ux-HIHMjINw

## 5. 주요 구현 기능
- CRUD(post, comment),
- 회원가입 및 인증(로그인/로그아웃)
- post 좋아요/싫어요/글쎄요 투표 기능
- comment 좋아요
- 팔로잉/팔로우
- 이미지 업로드(post 생성, 회원가입 프로필 이미지)
- 게시물, 댓글, 유저 찾기 팔로워/팔로잉 - React Query 페이지네이션, 무한 스크롤 기능

## 6. 문제 해결 및 추가 기능 설명
https://adam-37.gitbook.io/joomadeung/undefined-3/undefined/sns-app
