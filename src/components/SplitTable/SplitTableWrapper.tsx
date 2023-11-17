import React, { useEffect, useState } from 'react';
import SplitTable from '@/components/SplitTable/index.tsx';
import { ColumnsType } from 'antd/es/table/index';
import { cloneDeep } from 'lodash';
import NormalTable from '@/components/normalTable/index.tsx';

enum EPricingCycle {
  // 买断
  BUY_OUT,

  // 年
  YEAR,

  // 半年
  HALF_YEAR,

  // 季度
  QUARTER,

  // 月
  MONTH,

  // 天
  DAY
}

type QuotePriceDetailArrayItem = {
  id: string;
  classificationId: string; // 分类id
  classificationName: string; // 分类名称
  commodityId: string; // 商品id
  commodityName: string; //商品名称
  commodityDescription?: string; // 商品描述
  required: boolean; // 是否必选
  needMoreBuy: boolean; // 是否可以购买+赠送多个
  unit: string; // 单位
  catalogPrice: number; // 目录价
  price: number; //销售设置的价格
  allowGift: boolean; // 是否可以赠送
  minBuy?: number; // 购买+赠送的最小限制
  maxBuy?: number; // 购买+赠送的最大限制
  multipleBuy?: number; // 按整数倍购买
  minCycle?: number; // 最小有效期
  maxCycle?: number; // 最大有效期
  buyCount?: number; // 购买数量
  giftCount?: number; //赠送数量
  isBuy?: boolean; // 是否购买
  isGift?: boolean; // 是否赠送
  validityPeriod?: number; // 有效期
  pricingCycle: EPricingCycle;
  logo: string;
  storeName: string;
  storeType: number;

  front: true;
  frontCommodity: [];

  productId: 101;

  sort: 1;
};

type QuotePriceDetailItem = {
  logo: string;
  id: string;
  storeName: string;
  storeType: number;
  details: QuotePriceDetailArrayItem[];
  classificationNameSpan?: number;
  storeTypeSpan?: number;
  commodityDescription?: string;
  unit: string;
  catalogPrice: number;
  isGift: boolean;
  isBuy: boolean;
  pricingCycle: EPricingCycle;
  buyCount: number;
  giftCount: number;
  externalDiscountedPrice: number;
  externalTransactionPrice: number;
  totalDiscounted: boolean; // 是否是总计折扣行
  totalTransactionPrice?: boolean; // 是否是总计成交价行
  hasChildren: boolean;
  hasParent: boolean;
  front: boolean;
  frontCommodity: number[];
};

type TSplitTableWrapperProps<T> = {
  initData: T[];
  columns: ColumnsType<T>;
  gapHeightArrayProps: number[];
  maxHeightArrayProps: number[];
  marginTop: number;
  title?: string;
};

function SplitTableWrapper<T>(props: TSplitTableWrapperProps<T>) {
  const {
    marginTop,
    gapHeightArrayProps,
    maxHeightArrayProps,
    initData,
    title,
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
  const createNewArr = (
    data: {
      isBuy: boolean | undefined;
      storeType: number | undefined;
      buyCount: number | undefined;
      commodityDescription: string | undefined;
      giftCount: number | undefined;
      classificationId: string;
      validityPeriod: number | undefined;
      catalogPrice: number;
      unit: string;
      price: number;
      classificationName: string;
      isGift: boolean | undefined;
      storeName: string | undefined;
      pricingCycle: EPricingCycle;
      id: string | undefined;
      commodityName: string;
    }[],
    keyArray: string[]
  ) => {
    let result = data;
    const mapArrayByKey = (key: string, dataSource = data) => {
      // dataSource 需要处理的表格数据 key 就是需要合并单元格的唯一主键，我这里是projectId
      return dataSource
        .reduce((result: Partial<QuotePriceDetailItem>[], item: any) => {
          //首先将key字段作为新数组result取出
          if (result.indexOf(item[key]) < 0) {
            result.push(item[key]);
          }
          return result;
        }, [])
        .reduce((result: any[], value) => {
          //将key相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
          const children = dataSource.filter(
            (item: any) => item[key] === value
          );
          result = result.concat(
            children.map((item, index) => {
              return {
                ...item,
                [`${key}Span`]: index === 0 ? children.length : 0 //将第一行数据添加rowSpan字段
              };
            })
          );
          return result;
        }, []);
    };
    keyArray.map((item) => {
      result = mapArrayByKey(item, result);
    });
    return result;
  };
  return (
    <React.Fragment>
      {maxHeightArray.length > 0 ? (
        <React.Fragment>
          {data.map((array, dataIndex) => {
            const originArray = array.map((arrayItem, arrayItemIndex) => {
              return {
                key: arrayItemIndex,
                ...arrayItem
              };
            });
            const handleArray = createNewArr(originArray, [
              'storeType',
              'classificationName'
            ]);
            const copy = cloneDeep(handleArray);
            copy.sort((a, b) => a.key - b.key);
            const newCopy = copy.map((item) => {
              if (item.totalDiscounted) {
                item.storeTypeSpan = 1;
                item.classificationNameSpan = 1;
              }
              return item;
            });

            return (
              <SplitTable
                marginTop={marginTop}
                columns={columns}
                marginBottom={gapHeightArray[dataIndex]}
                maxHeight={
                  maxHeightArray[dataIndex] || maxHeightArray[data.length - 1]
                }
                onSplit={(index) => {
                  console.log(`table_${dataIndex}里超过了`);
                  console.log(index);
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
                data={newCopy}
              />
            );
          })}
        </React.Fragment>
      ) : (
        <NormalTable tableIndex={0} dataSource={data[0]} columns={columns} />
      )}
    </React.Fragment>
  );
}

export default SplitTableWrapper;
