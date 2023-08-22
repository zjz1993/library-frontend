import React, { useRef, useEffect } from 'react';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import cx from 'classnames';
import { Menu } from 'antd';
import styles from './index.module.less';
import { IBaseComponent } from '@/types/baseComponent.ts';
import useGlobalStore from '@/store/global.ts';

type ISideBarMenu = IBaseComponent;

const SideBarMenu: React.FC<ISideBarMenu> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { className, style } = props;

  const collapsed = useGlobalStore((state) => state.sideBarCollapse);

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

  const items: MenuProps['items'] = [
    getItem('Navigation One', 'sub1', <MailOutlined />, [
      getItem(
        'Item 1',
        'g1',
        null,
        [getItem('Option 1', '1'), getItem('Option 2', '2')],
        'group'
      ),
      getItem(
        'Item 2',
        'g2',
        null,
        [getItem('Option 3', '3'), getItem('Option 4', '4')],
        'group'
      )
    ]),

    getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
      getItem('Option 5', '5'),
      getItem('Option 6', '6'),
      getItem('Submenu', 'sub3', null, [
        getItem('Option 7', '7'),
        getItem('Option 8', '8')
      ])
    ]),

    { type: 'divider' },

    getItem('Navigation Three', 'sub4', <SettingOutlined />, [
      getItem('Option 9', '9'),
      getItem('Option 10', '10'),
      getItem('Option 11', '11'),
      getItem('Option 12', '12')
    ]),

    getItem(
      'Group',
      'grp',
      null,
      [getItem('Option 13', '13'), getItem('Option 14', '14')],
      'group'
    )
  ];
  const documentMove = (event: Event) => {
    console.log('documentMove');
    const e = event as MouseEvent;
    const moveLen = e.clientX;
    console.log(moveLen);
    //if (contentRef.current) {
    //  contentRef.current.style = `width: ${moveLen}px`;
    //}
  };
  const handleMouseDown = () => {
    console.log('handleMouseDown');
    if (ref.current) {
      document.addEventListener('mousemove', documentMove);
    }
  };
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('mousedown', handleMouseDown);
    }
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', documentMove);
    });
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, []);

  return (
    <div
      className={cx(className, collapsed && styles.hidden_sidebar)}
      style={style}
      ref={contentRef}
    >
      <Menu
        inlineCollapsed={collapsed}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      />
      <div ref={ref} className={styles.resize_bar} />
    </div>
  );
};
export default SideBarMenu;
