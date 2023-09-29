import React, { useEffect, useState } from 'react';
import { IBaseComponent } from '@/types/baseComponent.ts';
import { Form, Input, Modal, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { apiGetBookById } from '@/service/books.ts';
import { TBookDetail } from '@/types/book.ts';

interface IAddBookModalProps extends IBaseComponent {
  id?: number;
  children: React.ReactNode;
}

const AddBookModal: React.FC<IAddBookModalProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const { id, children } = props;
  const [data, setData] = useState<TBookDetail>();
  const [form] = Form.useForm();
  const { runAsync } = useRequest(
    () => {
      return apiGetBookById(id as number);
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res.code === 200) {
          setData(res.data);
        }
      }
    }
  );
  useEffect(() => {
    if (visible && id !== undefined) {
      runAsync();
    }
  }, [visible, runAsync, id]);
  const renderContent = () => {
    const formDom = (
      <Form form={form} initialValues={data}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: '请填写书名' }]}
          label="书名"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          rules={[{ required: true, message: '请填写介绍' }]}
          label="介绍"
        >
          <Input.TextArea showCount maxLength={255} />
        </Form.Item>
      </Form>
    );
    if (id) {
      return data ? formDom : <Spin />;
    }
    return formDom;
  };
  return (
    <React.Fragment>
      <div
        onClick={() => {
          setVisible(true);
        }}
      >
        {children}
      </div>
      <Modal
        title={id !== undefined ? '编辑书籍' : '创建书籍'}
        centered
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
      >
        {renderContent()}
      </Modal>
    </React.Fragment>
  );
};
export default AddBookModal;
