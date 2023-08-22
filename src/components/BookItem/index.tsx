import React from 'react';
import styles from './index.module.less';
import { IBaseComponent } from '@/types/baseComponent.ts';
import { TBook } from '@/types/book.ts';
import { Image } from 'antd';
import { useNavigate } from 'react-router-dom';

interface IBookItemProps extends IBaseComponent {
  book: TBook;
}

const BookItem: React.FC<IBookItemProps> = (props) => {
  const {
    book: { id, cover, name, desc }
  } = props;
  const navigate = useNavigate();
  return (
    <div
      className={styles.book}
      onClick={() => {
        navigate(`/books/${id}`);
      }}
    >
      <Image
        preview={false}
        src={cover || new URL('@/static/default.png', import.meta.url).href}
        className={styles.cover}
      />
      <div className={styles.title}>{name}</div>
      <div>{desc}</div>
    </div>
  );
};
export default BookItem;
