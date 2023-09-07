import React, { Suspense } from 'react';
import styles from './index.module.less';
import { Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import BaseHeader from '@/layout/baseHeader.tsx';
import SideBarMenu from '@/layout/sideBarMenu.tsx';

const BaseLayout: React.FC = (props) => {
  console.log('BaseLayout props');
  console.log(props);
  return (
    <div className={styles.page_wrapper}>
      <BaseHeader />
      <div className={styles.page}>
        <SideBarMenu className={styles.page_menu} />
        <div className={styles.page_content}>
          <Suspense fallback={<Spin />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
export default BaseLayout;
