import React, { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table/index';
import SpanSplitTable from '@/components/SpanSplitTable/index.tsx';
import { ExpandableConfig } from 'rc-table/lib/interface';

type SpanTSplitTableWrapperProps<T> = {
  initData: T[];
  columns: ColumnsType<T>;
  gapHeightArrayProps: number[];
  maxHeightArrayProps: number[];
  expandable?: ExpandableConfig<T>;
};

function SpanSplitTableWrapper<T>(props: SpanTSplitTableWrapperProps<T>) {
  const {
    expandable,
    gapHeightArrayProps,
    maxHeightArrayProps,
    initData,
    columns
  } = props;
  const [gapHeightArray, setGapHeightArray] = useState<number[]>([]);
  const [maxHeightArray, setMaxHeightArray] = useState<number[]>([]);
  const [splitIndexArray, setSplitIndexArray] = useState<number[]>([]);
  const [data, setData] = useState<any[][]>([initData]);
  useEffect(() => {
    setGapHeightArray(gapHeightArrayProps);
  }, [gapHeightArrayProps]);
  useEffect(() => {
    setMaxHeightArray(maxHeightArrayProps);
  }, [maxHeightArrayProps]);
  return (
    <React.Fragment>
      {maxHeightArray.length > 0 && (
        <React.Fragment>
          {data.map((array, dataIndex) => {
            const handleArray = array.map((arrayItem, arrayItemIndex) => {
              return {
                key: arrayItem.key || arrayItemIndex,
                ...arrayItem
              };
            });
            console.log(maxHeightArray);
            console.log(
              `table${dataIndex}的height是${maxHeightArray[dataIndex]}`
            );
            return (
              <SpanSplitTable
                expandable={expandable}
                columns={columns}
                marginBottom={gapHeightArray[dataIndex]}
                maxHeight={
                  maxHeightArray[dataIndex] || maxHeightArray[data.length - 1]
                }
                onSplit={(index) => {
                  setSplitIndexArray((prevState) => {
                    if (prevState.length === 0) {
                      prevState.push(index);
                    } else {
                      prevState.push(index + prevState[prevState.length - 1]);
                    }
                    return [...prevState];
                  });

                  function getSplitArray() {
                    const splitArray: any[] = [];
                    splitIndexArray.forEach((idx, index) => {
                      if (index === 0) {
                        splitArray.push(initData.slice(0, idx));
                        if (splitIndexArray.length === 1) {
                          splitArray.push(initData.slice(idx));
                        }
                      } else if (index === splitIndexArray.length - 1) {
                        splitArray.push(
                          initData.slice(splitIndexArray[index - 1], idx)
                        );
                        splitArray.push(initData.slice(idx));
                      } else {
                        splitArray.push(
                          initData.slice(splitIndexArray[index - 1], idx)
                        );
                      }
                    });
                    return splitArray;
                  }

                  console.log('getSplitArray()是');
                  console.log(getSplitArray());
                  setData(getSplitArray());
                }}
                data={handleArray}
              />
            );
          })}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default SpanSplitTableWrapper;
