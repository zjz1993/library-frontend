import React from 'react';
import styles from './index.module.less';
import { Button, Table } from 'antd';
import PdfLoader from '@/pages/PdfLoader.ts';

const PdfPage: React.FC = () => {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '3',
      name: '胡彦祖',
      age: 42,
      address: `西湖区湖底公园1号放假啊康师傅金卡戴珊剪发卡拉手机大{'\n'}发路科技是打发卡拉季阿达山卡拉腹肌看老大生发剂考拉受打击饭卡手机大发快升级发啦卡机放大`
    }
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
      width: 300
    }
  ];
  return (
    <div className={styles.pdf_page}>
      <div id="pdf_footer" className={styles.pdf_footer}>
        <div className={styles.pdf_footer_content}>
          <span className="current_page" style={{ marginRight: 10 }}></span>
          <span className="total_page"></span>
        </div>
      </div>
      <Button
        type="primary"
        style={{ width: 200 }}
        onClick={async () => {
          const pdf = new PdfLoader({
            pdfFileName: 'pdf',
            footer: document.getElementById('pdf_footer') as HTMLElement,
            splitClassName: 'ant-table-row',
            contentElement: document.getElementById(
              'quote_content'
            ) as HTMLElement,
            ele: document.getElementById('content_pdf') as HTMLElement
          });
          await pdf.outPutPdfFn('报价单');
        }}
      >
        打印pdf
      </Button>
      <div id="content_pdf">
        <div style={{ height: 1500 }}>
          特别长的div 特别长的div 特别长的div 特别长的div 特别长的div
          特别长的div 特别长的div 特别长的div 特别长的div 特别长的div
          特别长的div 特别长的div 特别长的div 特别长的div
        </div>
        <Table dataSource={dataSource} columns={columns} />;
      </div>
    </div>
  );
};
export default PdfPage;
