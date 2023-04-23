import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import Link from 'next/link';

const Wrapper = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & h3 {
    margin-bottom: 20px;
  }

  & h4 {
    text-align: center;
  }
`;

function NotFound() {
  return (
    <Wrapper>
      <h3>해당 페이지를 찾지 못했습니다.</h3>
      <div>
        <h4>주소가 잘못되었거나 </h4>
        <h4>더 이상 제공하지 않는 페이지입니다.</h4>
      </div>
      <img src="https://cdn.inflearn.com/assets/images/lost_pages/coding_cat.gif"></img>
      <Link href="/">
        <Button size="middle">메인 페이지로 이동</Button>
      </Link>
    </Wrapper>
  );
}

export default NotFound;
