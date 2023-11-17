import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table/index';
import { createUUID } from '@/utils/index.ts';

const ColSpanTable: React.FC = () => {
  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
    hasChild: boolean;
    children?: DataType[];
  }

  const createMockData = (len: number) => {
    const array: DataType[] = [];
    for (let i = 1; i <= len; i++) {
      array.push({
        key: createUUID(),
        name: `expand_${String(i)}`,
        age: Math.random(),
        address: createUUID(),
        hasChild: i === 3,
        tags: new Array(parseInt(String(i % 10))).fill(String(i % 10)),
        children: i === 3 ? createMockData(2) : undefined
      });
    }
    return array;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      )
    }
  ];

  const data: DataType[] = [
    {
      key: createUUID(),
      name: '1',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
      hasChild: true,
      children: createMockData(5)
    },
    {
      key: createUUID(),
      name: '2',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
      hasChild: false
    },
    {
      key: createUUID(),
      name: '3',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
      hasChild: false
    }
  ];
  const maxHeight = 120;
  const [sliceIndexState, setSliceIndexState] = useState<undefined | number>(
    undefined
  );
  const sliceIndex = useRef<undefined | number>(undefined);
  const totalHeight = useRef(0);
  const findItemByKey = (key: string) => {
    let result = -1;
    const fun = (array: DataType[]) => {
      for (let i = 0; i < array.length; i++) {
        const item = array[i];
        if (item.key === key) {
          result = i;
          return;
        }
        if (item.children) {
          fun(item.children);
        }
      }
    };
    fun(data);
    return result;
  };
  console.log('data是');
  console.log(data);
  const mockData = [
    {
      id: 1,
      name: 'a',
      children: [
        {
          id: 2,
          name: 'b',
          rowSpan: 2,
          children: [
            {
              id: 3,
              name: 'c'
            },
            {
              id: 7,
              name: 'd'
            },
            {
              id: 8,
              name: 'e'
            },
            {
              id: 9,
              name: 'f'
            }
          ]
        },
        {
          id: 4,
          name: 'g',
          children: [
            {
              id: 5,
              name: 'h',
              children: [
                {
                  id: 6,
                  name: 'i'
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  const mock1 = [
    {
      id: 1,
      name: 'a',
      children: [
        {
          id: 2,
          name: 'b',
          children: [
            {
              id: 3,
              name: 'c'
            }
          ]
        }
      ]
    }
  ];
  const mock2 = [
    {
      id: 7,
      name: 'd'
    },
    {
      id: 8,
      name: 'e'
    },
    {
      id: 9,
      name: 'f'
    },
    {
      id: 4,
      name: 'g',
      children: [
        {
          id: 5,
          name: 'h',
          children: [
            {
              id: 6,
              name: 'i'
            }
          ]
        }
      ]
    }
  ];
  const mockColumn = [
    {
      title: '产品及服务',
      dataIndex: 'product',
      key: 'product'
    },
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      onCell: (record) => {
        return {
          colSpan: record.rowSpan
        };
      }
    }
  ];
  return (
    <div>
      <Link to="/">回首页</Link>
      <Table
        dataSource={mockData}
        columns={mockColumn}
        expandable={{ defaultExpandAllRows: true }}
      />
      <Table
        dataSource={mock1}
        columns={mockColumn}
        expandable={{ defaultExpandAllRows: true }}
      />
      <Table
        dataSource={mock2}
        columns={mockColumn}
        expandable={{ defaultExpandAllRows: true }}
      />
      {/*<Table*/}
      {/*  rowKey="key"*/}
      {/*  expandable={{*/}
      {/*    defaultExpandAllRows: true*/}
      {/*  }}*/}
      {/*  components={{*/}
      {/*    body: {*/}
      {/*      row: (record: {*/}
      {/*        [x: string]: any;*/}
      {/*        children: React.ReactElement<*/}
      {/*          any,*/}
      {/*          string | React.JSXElementConstructor<any>*/}
      {/*        >;*/}
      {/*      }) => {*/}
      {/*        const key =*/}
      {/*          record['data-row-key'] ||*/}
      {/*          '97101f60-49e0-4ad2-9042-d606a9635fe2';*/}

      {/*        return (*/}
      {/*          <SpanSplitTableRow*/}
      {/*            //ref={ref}*/}
      {/*            record={record}*/}
      {/*            rowKey={key}*/}
      {/*            onAddHeight={(height) => {*/}
      {/*              if (maxHeight !== undefined) {*/}
      {/*                if (totalHeight.current + height > maxHeight) {*/}
      {/*                  if (sliceIndex.current === undefined) {*/}
      {/*                    console.log('超过时的record是');*/}
      {/*                    console.log(record);*/}
      {/*                    const index = findItemByKey(key);*/}
      {/*                    console.log('index是');*/}
      {/*                    console.log(index);*/}
      {/*                    console.log(key);*/}
      {/*                  }*/}
      {/*                } else {*/}
      {/*                  totalHeight.current += height;*/}
      {/*                }*/}
      {/*              }*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            {record.children}*/}
      {/*          </SpanSplitTableRow>*/}
      {/*        );*/}
      {/*      }*/}
      {/*    }*/}
      {/*  }}*/}
      {/*  columns={mockColumn}*/}
      {/*  dataSource={mockData}*/}
      {/*  pagination={false}*/}
      {/*/>*/}
    </div>
  );
};
export default ColSpanTable;
