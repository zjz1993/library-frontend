import React, { useCallback, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '@/routes/router.tsx';
import { getCookie } from '@/utils/cookie.ts';
import { apiGetUserInfo } from '@/service/user.ts';
import { ERole } from '@/enum/Role.ts';
import useGlobalStore, { IGlobalState } from '@/store/global.ts';
import { Feedback } from '.yalc/@digit-fe/digit-component-v5/dist/index';

function App() {
  const [loading, setLoading] = useState(true);
  const userInfo = useGlobalStore((state: IGlobalState) => state.userInfo);
  const updateUserInfo = useGlobalStore((state) => state.updateUserInfo);
  const user_token = getCookie('user_token');
  const getUserInfo = useCallback(async () => {
    const res = await apiGetUserInfo();
    console.log('App.tsx 加载用户信息');
    if (res.code === 200) {
      const { data } = res;
      setLoading(false);
      updateUserInfo({
        ...data,
        uid: 230080,
        role: data.username === 'zhaojunzhe' ? ERole.superAdmin : ERole.normal
      });
    }
  }, [updateUserInfo]);
  useEffect(() => {
    if (user_token) {
      console.log('执行判断');
      if (!userInfo) {
        setLoading(true);
        getUserInfo();
      }
    }
  }, [userInfo, getUserInfo, user_token]);
  return (
    <React.Fragment>
      <RouterProvider router={router} />
      <Feedback />
      {/*{loading ? <Spin /> : <RouterProvider router={router} />}*/}
    </React.Fragment>
  );
}

export default App;
