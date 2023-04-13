import { LeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import React from 'react';
import B from '../../Common/BackButton';
import P from './PostHeader.styles';

function PostHeader({ title }: { title?: string }) {
  const router = useRouter();
  return (
    <P.Wrapper>
      <B.BackButton
        type="dashed"
        shape="round"
        size="large"
        onClick={() => router.back()}
      >
        <LeftOutlined />
      </B.BackButton>

      {title && <div>{title}</div>}
    </P.Wrapper>
  );
}

export default PostHeader;
