import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { apiGetBooksList } from '@/service/books.ts';
import { TBook } from '@/types/book.ts';
import { Col, Empty, Row, Spin } from 'antd';
import BookItem from '@/components/BookItem/index.tsx';
import useBookStore, { IBookState } from '@/store/book.ts';

const IndexPage: React.FC = () => {
  const categoryId = useBookStore((state: IBookState) => state.categoryId);
  const [books, setBooks] = useState<TBook[]>([]);
  const { loading } = useRequest(
    () => {
      return apiGetBooksList(categoryId);
    },
    {
      refreshDeps: [categoryId],
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
        <React.Fragment>
          {books.length === 0 ? (
            <Empty />
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
        </React.Fragment>
      )}
    </div>
  );
};
export default IndexPage;
