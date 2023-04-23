import React from 'react';
import { Empty } from 'antd';

interface ICustomizedEmpty {
  desc1?: string;
  desc2?: string;
}

function CustomizedEmpty({ desc1, desc2 }: ICustomizedEmpty) {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <>
          <span style={{ display: 'block' }}>{desc1}</span>
          <span>{desc2}</span>
        </>
      }
    />
  );
}

export default CustomizedEmpty;
