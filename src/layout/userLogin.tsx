import React from 'react';
import { IBaseComponent } from '@/types/baseComponent.ts';
import { TUserInfo } from '@/types/userInfo.ts';
import { Dropdown, MenuProps } from 'antd';
import useGlobalStore from '@/store/global.ts';
import { ERole } from '@/enum/Role.ts';
import { useNavigate } from 'react-router-dom';

interface IUserLoginProps extends IBaseComponent {
  userInfo: TUserInfo;
}

const UserLogin: React.FC<IUserLoginProps> = (props) => {
  const navigate = useNavigate();
  const updateUserInfo = useGlobalStore((state) => state.updateUserInfo);
  const {
    userInfo: { username, role }
  } = props;
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '修改个人资料'
    },
    {
      type: 'divider'
    },
    {
      label: '退出登录',
      key: '3',
      onClick: () => {
        updateUserInfo(undefined);
      }
    }
  ];
  const adminItems: MenuProps['items'] = [
    {
      key: '1',
      label: '修改个人资料'
    },
    {
      key: '2',
      label: '管理后台',
      onClick: () => {
        navigate('/admin/library/create');
      }
    },
    {
      type: 'divider'
    },
    {
      label: '退出登录',
      key: '3',
      onClick: () => {
        updateUserInfo(undefined);
      }
    }
  ];
  return (
    <Dropdown menu={{ items: role === ERole.normal ? items : adminItems }}>
      <div>欢迎您：{username}</div>
    </Dropdown>
  );
};
export default UserLogin;
