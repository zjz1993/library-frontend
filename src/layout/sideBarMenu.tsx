import React, { useEffect, useState } from 'react';
import { MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Spin } from 'antd';
import cx from 'classnames';
import { IBaseComponent } from '@/types/baseComponent.ts';
import useGlobalStore, { IGlobalState } from '@/store/global.ts';
import { TCategoryProps } from '@/types/category.ts';
import { useRequest } from 'ahooks';
import { apiGetCategoryList } from '@/service/category.ts';
import { ERole } from '@/enum/Role.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiGetAdminCategoryList } from '@/service/admin.ts';

type ISideBarMenu = IBaseComponent;

const SideBarMenu: React.FC<ISideBarMenu> = (props) => {
  const [data, setData] = useState<TCategoryProps[]>();
  const { className, style } = props;
  const location = useLocation();
  const userInfo = useGlobalStore((state: IGlobalState) => state.userInfo);
  const navigate = useNavigate();
  type MenuItem = Required<MenuProps>['items'][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type
    } as MenuItem;
  }

  const renderMenu = () => {
    if (data) {
      if (userInfo?.role === ERole.superAdmin) {
        return [getItem('管理列表', 'sub1', <MailOutlined />, data)];
      }
      return [getItem('书籍种类列表', 'sub1', <MailOutlined />, data)];
    }
  };
  const { runAsync } = useRequest(
    (isAdmin?: boolean) => {
      if (isAdmin) {
        return apiGetAdminCategoryList();
      }
      return apiGetCategoryList();
    },
    {
      onSuccess: (res) => {
        console.log('执行加载menu');
        if (res.code === 200) {
          setData(res.data);
        }
      }
    }
  );
  useEffect(() => {
    if (
      userInfo?.role === ERole.superAdmin &&
      location.pathname.indexOf('/admin') > -1
    ) {
      runAsync(true);
    }
  }, [runAsync, location, userInfo]);

  return (
    <div className={cx(className)} style={style}>
      {data ? (
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={renderMenu()}
          onClick={(item) => {
            const path = item.item.props.path;
            console.log(item.item);
            if (path) {
              navigate(path);
            }
          }}
        />
      ) : (
        <Spin />
      )}
    </div>
  );
};
export default SideBarMenu;
