import React, { useEffect, useState } from 'react';
import { IBaseComponent } from '@/types/baseComponent.ts';
import useGlobalStore, { IGlobalState } from '@/store/global.ts';
import { ERole } from '@/enum/Role.ts';
import { Navigate } from 'react-router-dom';
import { getCookie } from '@/utils/cookie.ts';
import { apiGetUserInfo } from '@/service/user.ts';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';

const RequireAdmin: React.FC<IBaseComponent> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const userInfo = useGlobalStore((state: IGlobalState) => state.userInfo);
  const updateUserInfo = useGlobalStore((state) => state.updateUserInfo);
  const { runAsync } = useRequest(
    () => {
      return apiGetUserInfo();
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res.code === 200) {
          console.log('wrapper里加载');
          setLoading(false);
          const { data } = res;
          updateUserInfo({
            ...data,
            uid: 230080,
            role:
              data.username === 'zhaojunzhe' ? ERole.superAdmin : ERole.normal
          });
        }
      }
    }
  );
  const user_token = getCookie('user_token');
  useEffect(() => {
    if (user_token) {
      if (!userInfo) {
        setLoading(true);
        runAsync();
      } else {
        setLoading(false);
      }
    }
  }, [runAsync, userInfo, user_token]);
  return (
    <React.Fragment>
      {loading ? (
        <Spin />
      ) : (
        <React.Fragment>
          {userInfo?.role === ERole.superAdmin ? (
            children
          ) : (
            <Navigate to="/403" replace />
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default RequireAdmin;
