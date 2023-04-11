import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import W from './WritePostButton.styles';

function WritePostButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <W.StyledButton type="default" onClick={() => setOpen(true)}>
        <PlusOutlined />
      </W.StyledButton>
      <W.AddPostDrawer
        title="글쓰기 타입 선택"
        placement="bottom"
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        key="bottom"
        height={'auto'}
      >
        <Button
          type="text"
          shape="round"
          onClick={() => router.push('/post/create')}
        >
          OX 질문
        </Button>
        <Divider />
        <Button type="text" shape="round">
          자유글
        </Button>
        <Divider />
        <Button type="text" shape="round">
          유형 테스트
        </Button>
      </W.AddPostDrawer>
    </>
  );
}

export default WritePostButton;
