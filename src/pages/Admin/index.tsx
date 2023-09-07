import React, { Suspense } from 'react';
import { Spin } from 'antd';
import { Outlet } from 'react-router-dom';

const AdminIndex: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<Spin />}>
        <Outlet />
      </Suspense>
    </div>
  );
};
export default AdminIndex;
