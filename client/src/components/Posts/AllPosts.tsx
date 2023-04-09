import React, { useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import P from './Posts.styles';

function AllPosts() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <P.Wrapper>
      <P.HeaderWrapper>
        <P.HeaderLeft>
          <Image
            src="https://www.gravatar.com/avatar?d=mp&f=y"
            width={46}
            height={46}
            style={{ borderRadius: '50px' }}
            alt="avatar"
          />
          <P.PostInfo>
            <h4>유저이름</h4>
            <span>2023.03.30 · </span>
            <span>조회 234</span>
          </P.PostInfo>
        </P.HeaderLeft>
        <P.HeaderRight>
          <Button type="text" shape="circle" onClick={() => setOpen(true)}>
            <MoreOutlined />
          </Button>
        </P.HeaderRight>
      </P.HeaderWrapper>
      <P.BodyWrapper>
        <h3>여행비 600억 푸는 정보, 내수 활성화 효과 클까요?</h3>
      </P.BodyWrapper>

      <P.PostDrawer
        placement="bottom"
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        key="bottom"
        height={250}
      >
        <Button type="text" shape="round">
          공유
        </Button>
        <Divider />
        <Button type="text" shape="round">
          스크랩
        </Button>
        <Divider />
        <Button type="text" shape="round">
          팔로우
        </Button>
      </P.PostDrawer>
    </P.Wrapper>
  );
}

export default AllPosts;
