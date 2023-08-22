import React from 'react';
import { IBaseComponent } from '@/types/baseComponent.ts';
import useGlobalStore, { IGlobalState } from '@/store/global.ts';
import { ERole } from '@/enum/Role.ts';
import { Navigate } from 'react-router-dom';

const RequireAdmin: React.FC<IBaseComponent> = ({ children }) => {
  const userInfo = useGlobalStore((state: IGlobalState) => state.userInfo);
  return (
    <React.Fragment>
      {userInfo?.role === ERole.superAdmin ? (
        children
      ) : (
        <Navigate to="/403" replace />
      )}
    </React.Fragment>
  );
};
export default RequireAdmin;
