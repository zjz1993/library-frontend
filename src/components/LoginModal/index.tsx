import React, { useState } from 'react';
import { IBaseComponent } from '@/types/baseComponent.ts';
import { Form, Input, Modal } from 'antd';
import useGlobalStore from '@/store/global.ts';
import { ERole } from '@/enum/Role.ts';

interface ILoginModalProps extends IBaseComponent {
  children: React.ReactNode;
}

const LoginModal: React.FC<ILoginModalProps> = (props) => {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [visible, setVisible] = useState(false);
  const { children } = props;
  const updateUserInfo = useGlobalStore((state) => state.updateUserInfo);
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
        destroyOnClose
        closable={false}
        centered
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        okButtonProps={{
          title: '完成'
        }}
        onOk={async () => {
          const data = await form.validateFields();
          console.log(data);
          updateUserInfo({
            ...data,
            uid: 230080,
            role:
              data.username === 'zhaojunzhe' ? ERole.superAdmin : ERole.normal
          });
        }}
      >
        <div className="text-center text-2xl">登录&注册</div>
        <Form
          preserve={false}
          form={form}
          wrapperCol={{ span: 20 }}
          labelCol={{ span: 4 }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            help="密码至少6位，且包含字母和数字"
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message: '密码至少6位，且包含字母和数字'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          {mode === 'register' && (
            <Form.Item
              name="passwordConfirm"
              label="确认密码"
              rules={[
                {
                  required: true,
                  message: '请确认密码'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('确认密码和密码不一致，请检查')
                    );
                  }
                })
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}
        </Form>
        <div
          className="cursor-pointer text-blue"
          onClick={() => {
            if (mode === 'login') {
              setMode('register');
            } else {
              setMode('login');
            }
          }}
        >
          {mode === 'login' ? '还没账号？前去注册' : '已有账号？前去登录'}
        </div>
      </Modal>
    </React.Fragment>
  );
};
export default LoginModal;
