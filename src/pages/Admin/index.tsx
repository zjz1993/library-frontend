import React, { Suspense } from 'react';
import { Spin } from 'antd';
import { Outlet } from 'react-router-dom';

const AdminIndex: React.FC = () => {
  return (
    <div>
      管理首页
      <Suspense fallback={<Spin />}>
        <Outlet />
      </Suspense>
    </div>
  );
};
export default AdminIndex;
