import React from 'react';
import styles from './index.module.less';
import { IBaseComponent } from '@/types/baseComponent.ts';
import { TBook } from '@/types/book.ts';
import { Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

interface IBookItemProps extends IBaseComponent {
  book: TBook;
}

const BookItem: React.FC<IBookItemProps> = (props) => {
  const {
    book: { id, cover, name, description, createTime }
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
      <div>{description}</div>
      <div>添加日期：{dayjs(createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
    </div>
  );
};
export default BookItem;
