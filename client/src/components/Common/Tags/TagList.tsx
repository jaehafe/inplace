import { Space, Tag } from 'antd';
import Link from 'next/link';
import React from 'react';
import T from './TagList.styles';

interface ITagList {
  categories: {
    id: number;
    category: {
      id: number;
      name: string;
    };
  }[];
}

function TagList({ categories }: ITagList) {
  return (
    <T.TagContainer>
      <Space size={[0, 'small']} wrap>
        {categories.map((c) => {
          return (
            <Link href={`/tags/${c.id}`} key={c.id}>
              <Tag color="red">{c.category.name}</Tag>
            </Link>
          );
        })}
      </Space>
    </T.TagContainer>
  );
}

export default TagList;

{
  /* <Tag color="magenta">magenta</Tag>
      <Tag color="red">red</Tag>
      <Tag color="volcano">volcano</Tag>
      <Tag color="orange">orange</Tag>
      <Tag color="gold">gold</Tag>
      <Tag color="lime">lime</Tag>
      <Tag color="green">green</Tag>
      <Tag color="cyan">cyan</Tag>
      <Tag color="blue">blue</Tag>
      <Tag color="geekblue">geekblue</Tag>
      <Tag color="purple">purple</Tag> */
}
