import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { apiGetBooksList } from '@/service/books.ts';
import { TBook } from '@/types/book.ts';
import { Col, Row, Spin } from 'antd';
import BookItem from '@/components/BookItem/index.tsx';

const IndexPage: React.FC = () => {
  const [books, setBooks] = useState<TBook[]>([]);
  const { loading } = useRequest(
    () => {
      return apiGetBooksList();
    },
    {
      onSuccess: (res) => {
        setBooks(res.data.records);
      }
    }
  );
  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          {books.map((book) => {
            return (
              <Col key={book.id} span={6}>
                <BookItem book={book} />
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};
export default IndexPage;
