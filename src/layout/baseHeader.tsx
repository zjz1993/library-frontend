import React from 'react';
import styles from './index.module.less';
import { Button } from 'antd';
import LoginModal from '@/components/LoginModal/index.tsx';
import useGlobalStore, { IGlobalState } from '@/store/global.ts';
import UserLogin from '@/layout/userLogin.tsx';
import { useNavigate } from 'react-router-dom';

const BaseHeader: React.FC = () => {
  const navigate = useNavigate();
  const userInfo = useGlobalStore((state: IGlobalState) => state.userInfo);
  return (
    <div className={styles.page_header}>
      <div
        className="cursor-pointer"
        onClick={() => {
          navigate('/');
        }}
      >
        图书网
      </div>
      <div>
        {userInfo ? (
          <UserLogin userInfo={userInfo} />
        ) : (
          <LoginModal>
            <Button type="primary">登录</Button>
          </LoginModal>
        )}
      </div>
    </div>
  );
};
export default BaseHeader;
