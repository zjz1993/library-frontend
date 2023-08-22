import React from 'react'
import styles from './index.module.less'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import useGlobalStore from '@/store/global.ts'

const BaseHeader: React.FC = () => {
  const collapsed = useGlobalStore((state) => state.sideBarCollapse)
  const toggleSideBarCollapse = useGlobalStore(
    (state) => state.toggleSideBarCollapse
  )
  return (
    <div className={styles.page_header}>
      <Button
        type="primary"
        onClick={toggleSideBarCollapse}
        style={{ marginBottom: 16 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
    </div>
  )
}
export default BaseHeader
