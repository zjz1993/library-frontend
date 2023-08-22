import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { apiGetBookById } from '@/service/books.ts';
import { TBookDetail } from '@/types/book.ts';

const Detail: React.FC = () => {
  const [data, setData] = useState<TBookDetail>();
  const params = useParams();
  const { id } = params;
  useRequest(
    () => {
      return apiGetBookById(id as unknown as number);
    },
    {
      refreshDeps: [id],
      onSuccess: (res) => {
        if (res.code === 200) {
          setData(res.data);
        }
      }
    }
  );
  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">返回首页</Link>,
            key: 'home'
          }
        ]}
      />
      id: {id}
      {!data ? <Spin /> : <React.Fragment>{data.name}</React.Fragment>}
    </div>
  );
};
export default Detail;
