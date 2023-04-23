import React, { CSSProperties } from 'react';
import { Button, Empty } from 'antd';
import styled from 'styled-components';
import Link from 'next/link';
import { useUserInfo } from '../../store/userStore';

interface ICustomizedEmpty {
  desc1?: string;
  desc2?: string;
  buttonMessage?: string;
}

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  & span:nth-of-type(2) {
  }
`;

function CustomizedEmpty({ desc1, desc2, buttonMessage }: ICustomizedEmpty) {
  const currentLoginUser = useUserInfo();

  const routerLink = () => {
    if (buttonMessage === '게시글') {
      return '/post/create';
    } else if (buttonMessage === '댓글') {
      return '/';
    } else {
      return '/';
    }
  };

  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <EmptyWrapper>
          <span>{desc1}</span>
          <span>{desc2}</span>

          {buttonMessage && (
            <Link href={routerLink()}>
              <Button>{buttonMessage}</Button>
            </Link>
          )}
        </EmptyWrapper>
      }
    />
  );
}

export default CustomizedEmpty;
