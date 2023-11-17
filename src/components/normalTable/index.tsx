import React, { CSSProperties } from 'react';
import { Table } from 'antd';
import NormalTableRow from '@/components/normalTable/NormalTableRow.tsx';

type TNormalTableProps = {
  style?: CSSProperties;
  dataSource: any[];
  columns: any[];
  tableIndex: number;
};

const NormalTable: React.FC<TNormalTableProps> = (props) => {
  const { tableIndex, style, dataSource, columns } = props;
  return (
    <Table
      style={style}
      rowKey="id"
      pagination={false}
      dataSource={dataSource}
      columns={columns}
      components={{
        body: {
          row: (record: {
            [x: string]: any;
            children: React.ReactElement<
              any,
              string | React.JSXElementConstructor<any>
            >;
          }) => {
            const key = record['data-row-key'];
            return (
              <NormalTableRow
                //ref={ref}
                id={key}
                tableIndex={tableIndex}
              >
                {record.children}
              </NormalTableRow>
            );
          }
        }
      }}
    />
  );
};
export default NormalTable;
