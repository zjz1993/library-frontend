import React, { useState } from 'react';
import { Button, Space, Table } from 'antd';
import { createUUID } from '@/utils/index.ts';
import styles from './index.module.less';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table/index';
import NewPdfLoader from '@/NewPdfLoader.ts';
import SplitTableWrapper from '@/components/SplitTable/SplitTableWrapper.tsx';

interface DataType {
  // key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const SimplePDF: React.FC = () => {
  const createMockData = (len: number) => {
    const array: DataType[] = [];
    for (let i = 1; i <= len; i++) {
      array.push({
        name: String(i),
        age: Math.random(),
        address: createUUID(),
        tags: new Array(parseInt(String(i % 10))).fill(String(i % 10))
      });
    }
    return array;
  };
  const initData: DataType[] = createMockData(50);
  const [gapHeightArray, setGapHeightArray] = useState<number[]>([]);
  const [maxHeightArray, setMaxHeightArray] = useState<number[]>([]);
  const [isSplitTable, setIsSplitTable] = useState(false);
  const [loading, setLoading] = useState(false);

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
            return <div className={styles.tag}>{tag.toUpperCase()}</div>;
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

  const generatePdf = async () => {
    const pdf = new NewPdfLoader({
      tHeadHeight: 55,
      footer: document.getElementById('pdf_footer') as HTMLElement,
      contentElement: document.getElementById('content') as HTMLElement,
      ele: document.getElementById('content_pdf') as HTMLElement
    });

    const closeDomArray = await pdf.calcMaxHeight();
    const maxHeightArray: number[] = [];
    const tempGapHeightArray: number[] = [];
    console.log('closeDomArray是');
    console.log(closeDomArray);
    for (let i = 0; i < closeDomArray.length; i++) {
      if (closeDomArray[i].length > 0) {
        const dom = closeDomArray[i][0];
        maxHeightArray.push(dom.height);
        tempGapHeightArray.push(dom.marginBottom);
      }
    }
    const maxHeightArrayResult: number[] = [];
    maxHeightArray.forEach((height, index) => {
      if (index === 0) {
        maxHeightArrayResult.push(height);
      } else {
        maxHeightArrayResult.push(height - maxHeightArray[index - 1]);
      }
    });
    setIsSplitTable(true);
    setMaxHeightArray(maxHeightArrayResult);
    setGapHeightArray(tempGapHeightArray);

    setLoading(true);
    setTimeout(async () => {
      await pdf.outPutPdfFn('报价单');
      setLoading(false);
    }, 2000);
  };
  return (
    <div className={styles.pdf_page}>
      <div id="pdf_footer" className={styles.pdf_footer}>
        <div className={styles.pdf_footer_content}>
          <span className="current_page" style={{ marginRight: 10 }}></span>
          <span className="total_page"></span>
        </div>
      </div>
      <Button type="primary" onClick={generatePdf} loading={loading}>
        生成pdf
      </Button>
      <Link to="/">去复杂pdf</Link>
      <div id="content_pdf">
        <div id="content">
          <div
            style={{
              marginBottom: 30,
              height: 380,
              border: '1px solid red',
              width: '100%'
            }}
          >
            123
          </div>
          <div>
            {isSplitTable ? (
              <React.Fragment>
                <SplitTableWrapper<DataType>
                  columns={columns}
                  initData={initData}
                  marginTop={0}
                  maxHeightArrayProps={maxHeightArray}
                  gapHeightArrayProps={gapHeightArray}
                />
              </React.Fragment>
            ) : (
              <Table
                // key={uuidv4()}
                pagination={false}
                dataSource={initData}
                columns={columns}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SimplePDF;
