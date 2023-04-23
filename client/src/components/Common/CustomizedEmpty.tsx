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

  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <EmptyWrapper>
          <span>{desc1}</span>
          <span>{desc2}</span>

          {buttonMessage && (
            <Link href="/post/create">
              <Button>{buttonMessage}</Button>
            </Link>
          )}
        </EmptyWrapper>
      }
    />
  );
}

export default CustomizedEmpty;
