import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import React, { useState } from 'react';
import W from './WritePostButton.styles';

function WritePostButton() {
  const [open, setOpen] = useState(false);

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
        height={310}
      >
        <Button type="text" shape="round">
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
