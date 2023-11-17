import React, { useRef, useState } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table/index';
import SplitTableRow from '@/components/SplitTable/SplitTableRow.tsx';

type TSplitTableProps<DataType> = {
  columns: ColumnsType<DataType>;
  data: any;
  maxHeight?: number;
  onSplit: (index: number) => void;
  marginBottom?: number;
  marginTop?: number;
};

//const MAX_HEIGHT = 170;

const SplitTable: React.FC<TSplitTableProps<any>> = (props) => {
  const { marginTop, marginBottom, columns, maxHeight, data, onSplit } = props;
  const [sliceIndexState, setSliceIndexState] = useState<undefined | number>(
    undefined
  );
  const sliceIndex = useRef<undefined | number>(undefined);
  const totalHeight = useRef(0);
  return (
    <Table
      style={{ marginBottom: marginBottom || 0, marginTop: marginTop || 0 }}
      pagination={false}
      rowKey="id"
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
              <SplitTableRow
                //ref={ref}
                id={key}
                onAddHeight={(height) => {
                  if (maxHeight !== undefined) {
                    if (totalHeight.current + height >= maxHeight) {
                      if (sliceIndex.current === undefined) {
                        const index = data.findIndex((item) => item.id === key);
                        console.log('index是');
                        console.log(index);
                        console.log(key);
                        console.log(data);
                        console.log('此时的maxHeight是');
                        console.log(maxHeight);
                        if (index > -1) {
                          onSplit(index);
                          sliceIndex.current = index;
                          setSliceIndexState(index);
                        }
                      }
                    } else {
                      totalHeight.current += height;
                    }
                  }
                  //console.log('totalHeight是');
                  //console.log(key);
                  //console.log(totalHeight.current);
                }}
              >
                {record.children}
              </SplitTableRow>
            );
          }
        }
      }}
      columns={columns}
      dataSource={
        sliceIndexState === undefined ? data : data.slice(0, sliceIndexState)
      }
    />
  );
};
export default SplitTable;
