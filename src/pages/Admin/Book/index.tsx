import React, { useState } from 'react';
import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table/index';
import { TBook } from '@/types/book.ts';
import { useRequest } from 'ahooks';
import { apiAdminGetBooksList } from '@/service/books.ts';
import AddBookModal from '@/components/AddBookModal/index.tsx';

const LibraryIndex: React.FC = () => {
  const [data, setData] = useState<TBook[]>([]);

  const columns: ColumnsType<TBook> = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '书名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <AddBookModal id={record.id}>
            <a className="text-blue">编辑</a>
          </AddBookModal>
          <span className="cursor-pointer text-red">删除</span>
        </Space>
      )
    }
  ];
  const { loading } = useRequest(
    () => {
      return apiAdminGetBooksList();
    },
    {
      onSuccess: (res) => {
        if (res.code === 200) {
          setData(res.data.records);
        }
      }
    }
  );
  return (
    <div>
      <Space>
        图书列表
        <AddBookModal>
          <Button type="primary">添加书籍</Button>
        </AddBookModal>
      </Space>
      <Table loading={loading} dataSource={data} columns={columns} />
    </div>
  );
};
export default LibraryIndex;
