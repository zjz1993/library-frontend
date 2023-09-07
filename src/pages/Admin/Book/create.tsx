import React from 'react';
import { Button, Form, Input } from 'antd';

const LibraryCreate: React.FC = () => {
  const [form] = Form.useForm();
  return (
    <div>
      <h1 className="text-center">新增书籍</h1>
      <div style={{ width: 600, margin: '20px auto' }}>
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
        <div className="flex items-center justify-end gap-[8px]">
          <Button onClick={() => {}}>取消</Button>
          <Button type="primary" onClick={() => {}}>
            创建
          </Button>
        </div>
      </div>
    </div>
  );
};
export default LibraryCreate;
