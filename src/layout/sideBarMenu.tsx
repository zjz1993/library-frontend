import React, { useState } from 'react';
import { MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Spin } from 'antd';
import cx from 'classnames';
import { IBaseComponent } from '@/types/baseComponent.ts';
import useGlobalStore, { IGlobalState } from '@/store/global.ts';
import { TApiCategoryProps, TCategoryProps } from '@/types/category.ts';
import { useRequest, useUpdateEffect } from 'ahooks';
import { apiGetCategoryList } from '@/service/category.ts';
import { ERole } from '@/enum/Role.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiGetAdminCategoryList } from '@/service/admin.ts';
import useBookStore from '@/store/book.ts';

type ISideBarMenu = IBaseComponent;

const SideBarMenu: React.FC<ISideBarMenu> = (props) => {
  const updateCategoryId = useBookStore((state) => state.updateCategoryId);
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
      if (
        userInfo?.role === ERole.superAdmin &&
        location.pathname.indexOf('/admin') > -1
      ) {
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
      // manual: true,
      onSuccess: (res) => {
        console.log('执行加载menu');
        console.log(res);
        if (res.code === 200) {
          console.log(res.data);
          const treeArray = arrayToTree(res.data);
          setData(convertArray(treeArray));
        }
      }
    }
  );
  const convertArray = (array: TApiCategoryProps[]): TCategoryProps[] => {
    return array.map((item) => {
      const newItem: TCategoryProps = {
        ...item,
        label: item.title,
        key: item.id
      };
      if (item.children) {
        newItem.children = convertArray(item.children) as TCategoryProps[];
      }
      return newItem;
    });
  };
  const arrayToTree = (array: TApiCategoryProps[]) => {
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      const findItem = array.filter(
        (arrayItem) => arrayItem.parentId === item.id
      );
      if (findItem.length > 0) {
        if (!item.children) {
          item.children = findItem;
        } else {
          item.children = item.children.concat(findItem);
        }
      }
    }
    return array.filter((item) => !item.parentId);
  };
  useUpdateEffect(() => {
    if (
      userInfo?.role === ERole.superAdmin &&
      location.pathname.indexOf('/admin') > -1
    ) {
      runAsync(true);
    } else {
      runAsync(false);
    }
  }, [runAsync, location, userInfo]);
  //useMount(() => {
  //  runAsync(false);
  //});

  return (
    <div className={cx(className)} style={style}>
      {data ? (
        <Menu
          mode="inline"
          items={renderMenu()}
          onClick={(item) => {
            const path = (item as any).item.props.path;
            const id = (item as any).item.props.id;
            console.log(item);
            console.log(item.item);
            if (path) {
              navigate(path);
            } else {
              updateCategoryId(id);
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
