import React from 'react';
import { Tree, TreeDataNode } from 'antd';

const CategoryAdmin: React.FC = () => {
  const treeData: TreeDataNode[] = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          disabled: true,
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
              disableCheckbox: true
            },
            {
              title: 'leaf',
              key: '0-0-0-1'
            }
          ]
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [
            {
              title: <span style={{ color: '#1677ff' }}>sss</span>,
              key: '0-0-1-0'
            }
          ]
        }
      ]
    }
  ];
  return (
    <div>
      <Tree
        checkable
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        defaultSelectedKeys={['0-0-0', '0-0-1']}
        defaultCheckedKeys={['0-0-0', '0-0-1']}
        treeData={treeData}
      />
    </div>
  );
};
export default CategoryAdmin;
