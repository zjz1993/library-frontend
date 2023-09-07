import React, { useState } from 'react';
import { IBaseComponent } from '@/types/baseComponent.ts';
import { Form, Input, Modal } from 'antd';

interface IAddBookModalProps extends IBaseComponent {
  id?: number;
  children: React.ReactNode;
}

const AddBookModal: React.FC<IAddBookModalProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const { id, children } = props;
  const [form] = Form.useForm();
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
        <Form form={form}>
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
      </Modal>
    </React.Fragment>
  );
};
export default AddBookModal;
