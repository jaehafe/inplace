import { Space, Tag } from 'antd';
import Link from 'next/link';
import React from 'react';
import T from './Tags.styles';

interface ITags {
  categories: {
    id: number;
    category: {
      id: number;
      name: string;
    };
  }[];
}

function Tags({ categories }: ITags) {
  return (
    <T.TagContainer>
      <Space size={[0, 'small']} wrap>
        {categories.map((c: any) => {
          return (
            <Link href={`/tags/${c.id}`}>
              <Tag color="red" key={c.id}>
                {c.category.name}
              </Tag>
            </Link>
          );
        })}
      </Space>
    </T.TagContainer>
  );
}

export default Tags;

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
