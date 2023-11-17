import React, { useRef, useState } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table/index';
import CompleteSplitTableRow from '@/components/CompleteSplitTable/CompleteSplitTableRow.tsx';
import { ExpandableConfig } from 'rc-table/lib/interface';

type TSplitTableProps<DataType> = {
  columns: ColumnsType<DataType>;
  data: any;
  maxHeight?: number;
  onSplit: (index: number) => void;
  marginBottom?: number;
  expandable?: ExpandableConfig<DataType>;
};

//const MAX_HEIGHT = 170;

const CompleteSplitTable: React.FC<TSplitTableProps<any>> = (props) => {
  const { expandable, marginBottom, columns, maxHeight, data, onSplit } = props;
  const [sliceIndexState, setSliceIndexState] = useState<undefined | number>(
    undefined
  );
  const sliceIndex = useRef<undefined | number>(undefined);
  const totalHeight = useRef(0);
  return (
    <Table
      expandable={expandable}
      style={{ marginBottom: marginBottom || 0 }}
      pagination={false}
      components={{
        body: {
          row: (record: {
            [x: string]: any;
            children: React.ReactElement<
              any,
              string | React.JSXElementConstructor<any>
            >;
          }) => {
            const key =
              record['data-row-key'] || '97101f60-49e0-4ad2-9042-d606a9635fe2';
            return (
              <CompleteSplitTableRow
                //ref={ref}
                record={record}
                rowKey={key}
                onAddHeight={(height) => {
                  if (maxHeight !== undefined) {
                    if (totalHeight.current + height > maxHeight) {
                      if (sliceIndex.current === undefined) {
                        console.log('超过时的record是');
                        console.log(record);
                        const index = data.findIndex(
                          (item) => item.key === key
                        );
                        console.log('index是');
                        console.log(index);
                        console.log(key);
                        console.log(data);
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
                }}
              >
                {record.children}
              </CompleteSplitTableRow>
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
export default CompleteSplitTable;
