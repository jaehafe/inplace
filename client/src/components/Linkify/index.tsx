import React from 'react';
import Linkify from 'linkify-react';

import { Button, Modal, Space } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

interface ILinkifyText {
  text: string;
}

const showConfirm = (e: MouseEvent) => {
  e.preventDefault();
  Modal.confirm({
    title: '외부 링크로 연결됩니다.',
    icon: <ExclamationCircleFilled />,
    // content: 'Some descriptions',
    onOk(e) {
      // console.log('OK');
      window.open(e.target.getAttribute('href'));
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

function LinkifyText({ text }: ILinkifyText) {
  // const linkProps = {
  //   onClick: (e: MouseEvent) => {
  //     console.log('e.>>', e.target);

  //     showConfirm(e);

  //     // if (!confirm('Are you sure you want to leave this page?')) {
  //     //   e.preventDefault();
  //     // }
  //   },
  // };
  // options={{ attributes: linkProps }}
  return <Linkify>{text}</Linkify>;
}

export default LinkifyText;
