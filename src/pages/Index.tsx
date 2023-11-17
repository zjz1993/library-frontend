import React, { useState } from 'react';
import { Avatar, Button, Space, Table, Tooltip } from 'antd';
import { createUUID } from '@/utils/index.ts';
import styles from './index.module.less';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table/index';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import BigNumber from 'bignumber.js';
import SplitTableWrapper from '@/components/SplitTable/SplitTableWrapper.tsx';
import NewPdfLoader from '@/NewPdfLoader.ts';
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

interface DataType {
  // key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const IndexPage: React.FC = () => {
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
  const initData: DataType[] = createMockData(10);
  const initData1: DataType[] = createMockData(20);
  const [pdfInstance, setPdfInstance] = useState<any>();
  const [gapHeightArray, setGapHeightArray] = useState<number[][]>([]);
  const [marginTop, setMarginTop] = useState(0);
  const [maxHeightArray, setMaxHeightArray] = useState<number[][]>([]);
  const [isSplitTable, setIsSplitTable] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    const pdf = new NewPdfLoader({
      tHeadHeight: 55,
      footer: document.getElementById('pdf_footer') as HTMLElement,
      contentElement: document.getElementById('content') as HTMLElement,
      ele: document.getElementById('content_pdf') as HTMLElement
    });

    const closeDomArray = await pdf.calcMaxHeight();
    const simpleCloseDomArray = [];
    console.log('closeDomArray是');
    console.log(closeDomArray);

    for (let i = 0; i < closeDomArray.length; i++) {
      if (closeDomArray[i].length > 0) {
        const dom = closeDomArray[i][0];
        simpleCloseDomArray.push(dom);
      }
    }

    function split(array, field) {
      const keyArray = [...new Set(array.map((item) => item[field]))];
      const result = [];
      keyArray.forEach((key) => {
        const temp = array.filter((item) => item[field] === key);
        result.push({ [field]: key, data: temp });
      });
      return result;
    }

    const splitCloseDomArray = split(simpleCloseDomArray, 'tableIndex');
    const handleSplitCloseDomArray = () => {
      const maxHeightArray: number[][] = [];
      const gapHeightArray: number[][] = [];
      for (let i = 0; i < splitCloseDomArray.length; i++) {
        const splitDomArray = splitCloseDomArray[i].data;
        const tableIndex = splitCloseDomArray[i].tableIndex;
        const tempMaxHeightArray = [];
        const tempGapHeightArray = [];
        for (let y = 0; y < splitDomArray.length; y++) {
          const dom = splitDomArray[y];
          if (splitDomArray.length > 0) {
            tempMaxHeightArray.push(dom.height);
            tempGapHeightArray.push(dom.marginBottom);
            if (dom.marginTop) {
              setMarginTop(dom.marginTop);
            }
          }
        }
        maxHeightArray.push({ tableIndex, data: tempMaxHeightArray });
        gapHeightArray.push({ tableIndex, data: tempGapHeightArray });
      }
      console.log('maxHeightArray是');
      console.log(maxHeightArray);
      const maxHeightArrayResult: number[][] = [];
      maxHeightArray.forEach((maxHeightItem) => {
        const data = maxHeightItem.data;
        const tableIndex = maxHeightItem.tableIndex;
        data.forEach((height, index) => {
          if (index === 0) {
            maxHeightArrayResult.push({ tableIndex, data: [height] });
          } else {
            maxHeightArrayResult.push({
              tableIndex,
              data: [height - data[index - 1]]
            });
          }
        });
      });
      return {
        maxHeightArray: maxHeightArrayResult,
        gapHeightArray: gapHeightArray
      };
    };

    setIsSplitTable(true);
    const res = handleSplitCloseDomArray();
    setMaxHeightArray(res.maxHeightArray);
    setGapHeightArray(res.gapHeightArray);
    console.log('res是');
    console.log(res);
    //
    setLoading(true);
    setTimeout(async () => {
      await pdf.outPutPdfFn('报价单');
      setLoading(false);
    }, 2000);
  };

  //const data = [
  //  {
  //    wrapper: (
  //      <div
  //        onClick={() => {
  //          alert('点击了wrapper');
  //        }}
  //        className="wrapper"
  //      >
  //        wrapper
  //      </div>
  //    ),
  //    com: <div>123</div>
  //  },
  //  {
  //    com: <div>456</div>
  //  }
  //];
  //const ref = useRef(null);
  //const [value, setValue] = useState(0);
  //useMyClickAway(
  //  () => {
  //    console.log('点击了');
  //    setValue(value + 1);
  //  },
  //  ref,
  //  'contextmenu'
  //);
  const [tableData] = useState([
    [
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/1e934f59c26b-4a67-a9cd-5e14fd3c1f85.png',
        storeName: 'FineBI V6.0',
        storeType: 106,
        classificationId: 16,
        classificationName: '基础模块-Basic Module',
        commodityName: '基础模块（必选）',
        isBuy: true,
        buyCount: 1,
        commodityDescription:
          'BI-分析平台\nBI-自助数据分析\nBI-组件分析\nBI-仪表盘分析\nBI-数据解释\nBI-实时引擎\nBI-抽取引擎',
        catalogPrice: 450000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 450000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 10,
        classificationNameSpan: 1
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/1e934f59c26b-4a67-a9cd-5e14fd3c1f85.png',
        storeName: 'FineBI V6.0',
        storeType: 106,
        classificationId: 17,
        classificationName: '门户-Portal',
        commodityName: '决策平台（含数据门户）',
        isBuy: true,
        buyCount: 1,
        commodityDescription:
          '包含数据门户、外观配置、系统运维、系统配置、插件管理、用户管理、数据配置及用户信息监控的综合门户。',
        catalogPrice: 100000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 100000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 6
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/1e934f59c26b-4a67-a9cd-5e14fd3c1f85.png',
        storeName: 'FineBI V6.0',
        storeType: 106,
        classificationId: 17,
        classificationName: '门户-Portal',
        commodityName: '定时调度',
        isBuy: true,
        buyCount: 1,
        commodityDescription:
          '支持定时生成报表，定时转换数据，定时发送邮件、短信、移动端客户端信息，能指定报表生成目录，并以Web方式查看报表生成结果。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 20000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/1e934f59c26b-4a67-a9cd-5e14fd3c1f85.png',
        storeName: 'FineBI V6.0',
        storeType: 106,
        classificationId: 17,
        classificationName: '门户-Portal',
        commodityName: '智能运维',
        isBuy: true,
        buyCount: 1,
        commodityDescription:
          '智能检测系统存在的问题和风险，阈值预警，为系统稳定运行提供保障。',
        catalogPrice: 10000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 10000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/1e934f59c26b-4a67-a9cd-5e14fd3c1f85.png',
        storeName: 'FineBI V6.0',
        storeType: 106,
        classificationId: 17,
        classificationName: '门户-Portal',
        commodityName: '集团权限控制',
        isBuy: true,
        buyCount: 1,
        commodityDescription:
          '支持分配数据库连接权限、报表设计权限、以及报表查看和管理权限的多个层级的分配，借以达到多部门共用系统且有多个管理员时候权限多级分配的目的。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 20000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/1e934f59c26b-4a67-a9cd-5e14fd3c1f85.png',
        storeName: 'FineBI V6.0',
        storeType: 106,
        classificationId: 17,
        classificationName: '门户-Portal',
        commodityName: '短信平台',
        isBuy: true,
        buyCount: 1,
        commodityDescription:
          '整合短信平台，无缝对接帆软系统和模板的短信通知，比如任务失败通知、身份验证、系统消息通知等等；功能点默认包含5万条国内短信。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 20000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/1e934f59c26b-4a67-a9cd-5e14fd3c1f85.png',
        storeName: 'FineBI V6.0',
        storeType: 106,
        classificationId: 17,
        classificationName: '门户-Portal',
        commodityName: '数据预警',
        isBuy: true,
        buyCount: 1,
        commodityDescription:
          '低成本业务人员自主创建，自动化监控业务核心数据，数据异常及时通过邮箱、客户端、第三方等通知。',
        catalogPrice: 50000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 50000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/1e934f59c26b-4a67-a9cd-5e14fd3c1f85.png',
        storeName: 'FineBI V6.0',
        storeType: 106,
        classificationId: 18,
        classificationName: '移动端-Mobile',
        commodityName: '移动决策平台',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '在IOS和android移动端查看报表的APP，是用于综合查看报表的门户。报表的增减、管理需要在PC端决策平台上配置。',
        catalogPrice: 40000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 2
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/1e934f59c26b-4a67-a9cd-5e14fd3c1f85.png',
        storeName: 'FineBI V6.0',
        storeType: 106,
        classificationId: 18,
        classificationName: '移动端-Mobile',
        commodityName: '移动端BI展现',
        isBuy: true,
        buyCount: 1,
        commodityDescription:
          'BI的dashboard模板可以在移动设备上以移动端属性展示，比如自适应、手势操作等效果，也支持将dashboard模板集成到用户自主开发的APP上。',
        catalogPrice: 60000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 60000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/1e934f59c26b-4a67-a9cd-5e14fd3c1f85.png',
        storeName: 'FineBI V6.0',
        storeType: 106,
        classificationId: 19,
        classificationName: '数据开发-ETL',
        commodityName: '数据开发模块',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '常规节点\n循环容器\n调度配置\n任务运维\n数据转换-基础算子包\n数据转换-高级算子包\n基础数据源',
        catalogPrice: 130000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 1
      },
      {
        catalogPrice: 0,
        classificationId: '',
        classificationName: '',
        commodityName: '',
        id: createUUID(),
        price: '401500.00',
        totalDiscounted: true,
        pricingCycle: 0,
        storeName: '',
        storeType: 0,
        unit: '',
        storeTypeSpan: 1,
        classificationNameSpan: 1
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/350aacf4e8b8-4f14-a9dc-3618c1bd08a1.png',
        storeName: 'FineBI-设计用户',
        storeType: 109,
        classificationId: 25,
        classificationName: 'BI-设计用户',
        commodityName: '设计用户',
        isBuy: true,
        buyCount: 20,
        catalogPrice: 10000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 200000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 1,
        classificationNameSpan: 1
      },
      {
        catalogPrice: 0,
        classificationId: '',
        classificationName: '',
        commodityName: '',
        id: createUUID(),
        price: '130000.00',
        totalDiscounted: true,
        pricingCycle: 0,
        storeName: '',
        storeType: 0,
        unit: '',
        storeTypeSpan: 1,
        classificationNameSpan: 1
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/4b7d2d5cf804-4f9d-a0d4-15e9ad659d41.png',
        storeName: 'FineBI-查看用户',
        storeType: 110,
        classificationId: 26,
        classificationName: 'BI-查看用户',
        commodityName: '查看用户',
        isBuy: true,
        buyCount: 180,
        catalogPrice: 5000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 900000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 1,
        classificationNameSpan: 1
      },
      {
        catalogPrice: 0,
        classificationId: '',
        classificationName: '',
        commodityName: '',
        id: createUUID(),
        price: '810000.00',
        totalDiscounted: true,
        pricingCycle: 0,
        storeName: '',
        storeType: 0,
        unit: '',
        storeTypeSpan: 1,
        classificationNameSpan: 1
      }
    ],
    //[
    //  {
    //    id: createUUID(),
    //    logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/64d69cfd21b9-490e-8f4e-d01c1032a487.png',
    //    storeName: 'FineDataLink V4.0',
    //    storeType: 107,
    //    classificationId: 21,
    //    classificationName: 'ETL基础版',
    //    commodityName: '基础模块（必选）',
    //    isBuy: true,
    //    buyCount: 1,
    //    commodityDescription: '数据开发\n数据源管理\nB/S平台',
    //    catalogPrice: 150000,
    //    unit: '个',
    //    isGift: false,
    //    giftCount: 0,
    //    pricingCycle: 0,
    //    validityPeriod: 1,
    //    price: 150000,
    //    hasChildren: false,
    //    hasParent: true,
    //    storeTypeSpan: 11,
    //    classificationNameSpan: 1
    //  },
    //  {
    //    id: createUUID(),
    //    logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/64d69cfd21b9-490e-8f4e-d01c1032a487.png',
    //    storeName: 'FineDataLink V4.0',
    //    storeType: 107,
    //    classificationId: 22,
    //    classificationName: 'ETL增强包',
    //    commodityName: '进阶数据源-大数据',
    //    isBuy: false,
    //    buyCount: 0,
    //    commodityDescription:
    //      '包含大数据场景中常见的数据源种类，如数仓引擎SAP HANA、Hive，Impala，Presto、ClickHouse等。',
    //    catalogPrice: 80000,
    //    unit: '个',
    //    isGift: false,
    //    giftCount: 0,
    //    pricingCycle: 0,
    //    validityPeriod: 1,
    //    price: 0,
    //    hasChildren: false,
    //    hasParent: true,
    //    storeTypeSpan: 0,
    //    classificationNameSpan: 1
    //  },
    //  {
    //    id: createUUID(),
    //    logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/64d69cfd21b9-490e-8f4e-d01c1032a487.png',
    //    storeName: 'FineDataLink V4.0',
    //    storeType: 107,
    //    classificationId: 23,
    //    classificationName: '实时增强包',
    //    commodityName: '数据管道',
    //    isBuy: false,
    //    buyCount: 0,
    //    commodityDescription: '管道任务\n数据监控及补全',
    //    catalogPrice: 150000,
    //    unit: '个',
    //    isGift: false,
    //    giftCount: 0,
    //    pricingCycle: 0,
    //    validityPeriod: 1,
    //    price: 0,
    //    hasChildren: false,
    //    hasParent: true,
    //    storeTypeSpan: 0,
    //    classificationNameSpan: 8
    //  },
    //  {
    //    id: createUUID(),
    //    logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/64d69cfd21b9-490e-8f4e-d01c1032a487.png',
    //    storeName: 'FineDataLink V4.0',
    //    storeType: 107,
    //    classificationId: 23,
    //    classificationName: '实时增强包',
    //    commodityName: '高阶数据源-简道云（API&Webhook）',
    //    isBuy: false,
    //    buyCount: 0,
    //    commodityDescription:
    //      '针对简道云应用的API&Webhook进行易用性优化定制数据源，满足定时同步和实时同步场景。',
    //    catalogPrice: 10000,
    //    unit: '个',
    //    isGift: false,
    //    giftCount: 0,
    //    pricingCycle: 0,
    //    validityPeriod: 1,
    //    price: 0,
    //    hasChildren: false,
    //    hasParent: true,
    //    storeTypeSpan: 0,
    //    classificationNameSpan: 0
    //  },
    //  {
    //    id: createUUID(),
    //    logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/64d69cfd21b9-490e-8f4e-d01c1032a487.png',
    //    storeName: 'FineDataLink V4.0',
    //    storeType: 107,
    //    classificationId: 23,
    //    classificationName: '实时增强包',
    //    commodityName: '高阶数据源-Mysql（Binlog）',
    //    isBuy: false,
    //    buyCount: 0,
    //    commodityDescription:
    //      '基于Mysql的Binlog日志解析进行数据增量抽取，支持数据本身及其元数据（DDL）的增量变化，要求Mysql5.6及以上。',
    //    catalogPrice: 30000,
    //    unit: '个',
    //    isGift: false,
    //    giftCount: 0,
    //    pricingCycle: 0,
    //    validityPeriod: 1,
    //    price: 0,
    //    hasChildren: false,
    //    hasParent: true,
    //    storeTypeSpan: 0,
    //    classificationNameSpan: 0
    //  },
    //  {
    //    id: createUUID(),
    //    logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/64d69cfd21b9-490e-8f4e-d01c1032a487.png',
    //    storeName: 'FineDataLink V4.0',
    //    storeType: 107,
    //    classificationId: 23,
    //    classificationName: '实时增强包',
    //    commodityName: '高阶数据源-Oracle（Logminer）',
    //    isBuy: false,
    //    buyCount: 0,
    //    commodityDescription:
    //      '基于Oracle的Logminer日志解析进行数据增量抽取，支持数据本身及其元数据（DDL）的增量变化，要求Oracle版本在9i ~ 19c。',
    //    catalogPrice: 60000,
    //    unit: '个',
    //    isGift: false,
    //    giftCount: 0,
    //    pricingCycle: 0,
    //    validityPeriod: 1,
    //    price: 0,
    //    hasChildren: false,
    //    hasParent: true,
    //    storeTypeSpan: 0,
    //    classificationNameSpan: 0
    //  },
    //  {
    //    id: createUUID(),
    //    logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/64d69cfd21b9-490e-8f4e-d01c1032a487.png',
    //    storeName: 'FineDataLink V4.0',
    //    storeType: 107,
    //    classificationId: 23,
    //    classificationName: '实时增强包',
    //    commodityName: '高阶数据源-Oracle（CDC）',
    //    isBuy: false,
    //    buyCount: 0,
    //    commodityDescription:
    //      '基于Oracle的CDC最小基本日志进行数据增量抽取，仅支持数据本身的增量变化，要求Oracle版本在9i~11c。',
    //    catalogPrice: 10000,
    //    unit: '个',
    //    isGift: false,
    //    giftCount: 0,
    //    pricingCycle: 0,
    //    validityPeriod: 1,
    //    price: 0,
    //    hasChildren: false,
    //    hasParent: true,
    //    storeTypeSpan: 0,
    //    classificationNameSpan: 0
    //  },
    //  {
    //    id: createUUID(),
    //    logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/64d69cfd21b9-490e-8f4e-d01c1032a487.png',
    //    storeName: 'FineDataLink V4.0',
    //    storeType: 107,
    //    classificationId: 23,
    //    classificationName: '实时增强包',
    //    commodityName: '高阶数据源-Sqlserver（CDC）',
    //    isBuy: false,
    //    buyCount: 0,
    //    commodityDescription:
    //      '基于Sqlserver的CDC最小基本日志进行数据增量抽取，仅支持数据本身的增量变化，要求Sqlserver版本在为企业版（Enterprise Edition）需要 2008 及以上版本，标准版（Standard）需要 2016SP1 及以上版本。',
    //    catalogPrice: 10000,
    //    unit: '个',
    //    isGift: false,
    //    giftCount: 0,
    //    pricingCycle: 0,
    //    validityPeriod: 1,
    //    price: 0,
    //    hasChildren: false,
    //    hasParent: true,
    //    storeTypeSpan: 0,
    //    classificationNameSpan: 0
    //  },
    //  {
    //    id: createUUID(),
    //    logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/64d69cfd21b9-490e-8f4e-d01c1032a487.png',
    //    storeName: 'FineDataLink V4.0',
    //    storeType: 107,
    //    classificationId: 23,
    //    classificationName: '实时增强包',
    //    commodityName: '高阶数据源-PostgreSQL（wal2json）',
    //    isBuy: false,
    //    buyCount: 0,
    //    commodityDescription:
    //      '基于PostgreSQL的wal2json日志解析进行数据增量抽取，仅支持数据本身的增量变化，要求PostgreSQL9.6 及以上。',
    //    catalogPrice: 30000,
    //    unit: '个',
    //    isGift: false,
    //    giftCount: 0,
    //    pricingCycle: 0,
    //    validityPeriod: 1,
    //    price: 0,
    //    hasChildren: false,
    //    hasParent: true,
    //    storeTypeSpan: 0,
    //    classificationNameSpan: 0
    //  },
    //  {
    //    id: createUUID(),
    //    logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/64d69cfd21b9-490e-8f4e-d01c1032a487.png',
    //    storeName: 'FineDataLink V4.0',
    //    storeType: 107,
    //    classificationId: 23,
    //    classificationName: '实时增强包',
    //    commodityName: '高阶数据源-IBM DB2',
    //    isBuy: false,
    //    buyCount: 0,
    //    commodityDescription:
    //      '基于IBM DB2的CDC最小基本日志进行数据增量抽取，仅支持数据本身的增量变化，要求DB2为Enterprise Server Edition版本。',
    //    catalogPrice: 60000,
    //    unit: '个',
    //    isGift: false,
    //    giftCount: 0,
    //    pricingCycle: 0,
    //    validityPeriod: 1,
    //    price: 0,
    //    hasChildren: false,
    //    hasParent: true,
    //    storeTypeSpan: 0,
    //    classificationNameSpan: 0
    //  },
    //  {
    //    id: createUUID(),
    //    logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/64d69cfd21b9-490e-8f4e-d01c1032a487.png',
    //    storeName: 'FineDataLink V4.0',
    //    storeType: 107,
    //    classificationId: 24,
    //    classificationName: 'API数据服务增强包',
    //    commodityName: '数据服务',
    //    isBuy: false,
    //    buyCount: 0,
    //    commodityDescription: 'API数据准备\nAPI管理\nAPI监控天',
    //    catalogPrice: 100000,
    //    unit: '个',
    //    isGift: false,
    //    giftCount: 0,
    //    pricingCycle: 0,
    //    validityPeriod: 1,
    //    price: 0,
    //    hasChildren: false,
    //    hasParent: true,
    //    storeTypeSpan: 0,
    //    classificationNameSpan: 1
    //  },
    //  {
    //    catalogPrice: 0,
    //    classificationId: '',
    //    classificationName: '',
    //    commodityName: '',
    //    id: createUUID(),
    //    price: 360000,
    //    totalDiscounted: true,
    //    pricingCycle: 0,
    //    storeName: '',
    //    storeType: 0,
    //    unit: '',
    //    storeTypeSpan: 1,
    //    classificationNameSpan: 1
    //  }
    //],
    [
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 7,
        classificationName: '报表-基础模块',
        commodityName: '报表-基础模块',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '多数据源关联\n多sheet报表设计\n多报表运行环境\n增强分析统计模块\n参数查询界面\n模版权限继承\nAlpha Fine\n远程设计\n模板助手\n组件式设计\nH5动态图表',
        catalogPrice: 102000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 32,
        classificationNameSpan: 1
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 8,
        classificationName: '报表-CPT',
        commodityName: '聚合报表',
        isBuy: true,
        buyCount: 1,
        commodityDescription:
          '以画板方式放置报表元素，并能对任意报表元素进行编辑和组合，实现扩展分离。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 20000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 4
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 8,
        classificationName: '报表-CPT',
        commodityName: '数据分析',
        isBuy: true,
        buyCount: 1,
        commodityDescription:
          '在web页面中对展现数据进行筛选、过滤和排序等分析操作。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 20000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 8,
        classificationName: '报表-CPT',
        commodityName: '打印导出',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '精确清晰实现各类打印，可实现零客户端打印，也可通过客户端实现静默打印等其他诸多高级功能；模板导出支持pdf、excel、word、图片等等各种格式。',
        catalogPrice: 10000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 8,
        classificationName: '报表-CPT',
        commodityName: 'Word报告',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '基于word插入数据、表格、图表等动态元素进行word类型报告的设计。',
        catalogPrice: 50000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 9,
        classificationName: '仪表盘-FRM',
        commodityName: '决策报表',
        isBuy: true,
        buyCount: 1,
        commodityDescription:
          '通过简单灵活的组件拖拽操作方式快速制作组件式报表，比传统格子报表更美观，可以自适应屏幕的大小和分辨率，智能排布组件布局，交互效果更佳，极适合构建决策驾驶舱。',
        catalogPrice: 40000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 40000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 2
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 9,
        classificationName: '仪表盘-FRM',
        commodityName: 'FRMBS布局',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '支持在web端进行frm的布局调整，加快frm设计调试效率。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 10,
        classificationName: '大屏-FVS',
        commodityName: 'FVS大屏报表',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '可以新建专用于大屏设计的模板，模板开发完全所见即所得，并内置多种图片素材和轮播容器、监控视频等大屏常用组件功能。注意，没有此功能时FVS页面过渡和FVS三维组件均不可用。',
        catalogPrice: 80000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 5
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 10,
        classificationName: '大屏-FVS',
        commodityName: 'FVS页面过渡',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '支持多个分页的大屏设计，在展示时可进行多分页的自动轮播、手动切换，分页之间切换时平滑过渡，相同的组件不需重新加载，适用于故事性大屏汇报与展示场景。',
        catalogPrice: 40000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 10,
        classificationName: '大屏-FVS',
        commodityName: 'FVS三维组件-三维城市',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '支持导入含有地理信息的geojson数据文件，自动生成三维的城市效果，无需建模即可构建酷炫的3D城市、社区、园区等大屏场景。',
        catalogPrice: 40000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 10,
        classificationName: '大屏-FVS',
        commodityName: 'FVS三维组件-自定义模型',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '支持导入glb格式的用户自定义模型，零代码完成布局调整、特效配置和交互事件，低门槛构建智慧园区、产线、车间、设备等3D场景。',
        catalogPrice: 40000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 10,
        classificationName: '大屏-FVS',
        commodityName: 'FVS三维组件-Unity集成',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '支持导入基于unity平台的webgl资源包，是FVS三维能力的扩展，同时很好地融合FVS已有的设计，支持FVS的数据源、图表可视化元素，及联动、跳转、弹框等交互事件。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 11,
        classificationName: '增强显示',
        commodityName: '图表高级交互',
        isBuy: true,
        buyCount: 1,
        commodityDescription:
          '包括图表联动（点击图表中数据，其余图表或单元格数据变化），监控刷新（数据库中数据变化时，图表对应实时动态变化并提示变化内容）和闪烁动画（闪烁显示某些重要图形）。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 20000,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 3
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 11,
        classificationName: '增强显示',
        commodityName: '扩展图表',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '基于webgl等技术开发，作为基础图表的补充，包含一些展示形态新颖或展示效果酷炫的新图表。常用于大屏等场景下。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 11,
        classificationName: '增强显示',
        commodityName: '地图',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '将与地理位置有关的属性、指标等直观地反映在地图上，支持内置地图、自定义地图以及GIS地图，让数据以地图的形式展现出来。',
        catalogPrice: 40000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 12,
        classificationName: '填报',
        commodityName: '数据录入',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '将数据录入到数据库中，支持同时录入不同库，不同表。',
        catalogPrice: 40000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 3
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 12,
        classificationName: '填报',
        commodityName: '数据多级上报',
        isBuy: false,
        buyCount: 0,
        commodityDescription: '支持简单配置即可实现数据的多级上报功能。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 12,
        classificationName: '填报',
        commodityName: 'Excel导入',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '支持在浏览器端和不预览数据批量将excel中的数据导入到数据库中。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 13,
        classificationName: '门户',
        commodityName: '决策平台',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '包含数据门户、外观配置、系统运维、系统配置、插件管理、用户管理、数据配置及用户信息监控的综合门户。',
        catalogPrice: 30000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 7
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 13,
        classificationName: '门户',
        commodityName: '数据门户',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          'PC端数据门户以一个页面集合所有日常所需的数据入口，高效搭建企业统一门户、并支持多角色定制首页、个性化自定义首页等场景，提升决策平台的功能完整性、丰富度；\n移动端门户进一步提升移动端使用效率，打造企业工作台，重点信息一手获知。',
        catalogPrice: 70000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 13,
        classificationName: '门户',
        commodityName: '定时调度',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '支持定时生成报表，定时转换数据，定时发送邮件、短信、移动端客户端信息，能指定报表生成目录，并以Web方式查看报表生成结果。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 13,
        classificationName: '门户',
        commodityName: '智能运维',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '智能检测系统存在的问题和风险，阈值预警，为系统稳定运行提供保障。',
        catalogPrice: 10000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 13,
        classificationName: '门户',
        commodityName: '集团权限控制',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '支持分配数据库连接权限、报表设计权限、以及报表查看和管理权限的多个层级的分配，借以达到多部门共用系统且有多个管理员时候权限多级分配的目的。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 13,
        classificationName: '门户',
        commodityName: '短信平台',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '整合短信平台，无缝对接帆软系统和模板的短信通知，比如任务失败通知、身份验证、系统消息通知等等；功能点默认包含5万条国内短信。',
        catalogPrice: 20000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 13,
        classificationName: '门户',
        commodityName: '数据预警',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '低成本业务人员自主创建，自动化监控业务核心数据，数据异常及时通过邮箱、客户端、第三方等通知。',
        catalogPrice: 50000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 14,
        classificationName: '移动端',
        commodityName: '移动决策平台',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '在IOS和android移动端查看报表的APP，是用于综合查看报表的门户。报表的增减、管理需要在PC端决策平台上配置。',
        catalogPrice: 40000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 3
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 14,
        classificationName: '移动端',
        commodityName: '移动端报表展现',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          'cpt报表、frm表单、填报报表可以在移动设备上以移动端属性展示，比如自适应、手势操作等效果，也支持将报表集成到用户自主开发的APP上。',
        catalogPrice: 40000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 14,
        classificationName: '移动端',
        commodityName: 'APP打包',
        isBuy: false,
        buyCount: 0,
        commodityDescription:
          '在帆软市场使用APP打包功能，对IOS和Android移动端APP进行OEM，更换APP图标、名字、内置服务器等，打造企业自己的APP，并进行发布，实现自主版本管控。5W为买断价格，按年收费标准为1W/年。',
        catalogPrice: 50000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 15,
        classificationName: '移动集成',
        commodityName: '微信集成',
        isBuy: false,
        buyCount: 0,
        commodityDescription: '支持集成接入微信或企业微信。',
        catalogPrice: 5000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 4
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 15,
        classificationName: '移动集成',
        commodityName: '钉钉集成',
        isBuy: false,
        buyCount: 0,
        commodityDescription: '支持集成接入钉钉。',
        catalogPrice: 5000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 15,
        classificationName: '移动集成',
        commodityName: '飞书集成',
        isBuy: false,
        buyCount: 0,
        commodityDescription: '支持集成接入飞书。',
        catalogPrice: 5000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        id: createUUID(),
        logo: 'https://shequ-oss.obs.cn-east-2.myhuaweicloud.com:443/myfr/sales/05c203451d57-48c9-a6d0-b4f53de964bc.png',
        storeName: 'FineReport V11.0',
        storeType: 105,
        classificationId: 15,
        classificationName: '移动集成',
        commodityName: 'Welink集成',
        isBuy: false,
        buyCount: 0,
        commodityDescription: '支持集成接入Welink。',
        catalogPrice: 5000,
        unit: '个',
        isGift: false,
        giftCount: 0,
        pricingCycle: 0,
        validityPeriod: 1,
        price: 0,
        hasChildren: false,
        hasParent: true,
        storeTypeSpan: 0,
        classificationNameSpan: 0
      },
      {
        catalogPrice: 0,
        classificationId: '',
        classificationName: '',
        commodityName: '',
        id: createUUID(),
        price: 25000,
        totalDiscounted: true,
        pricingCycle: 0,
        storeName: '',
        storeType: 0,
        unit: '',
        storeTypeSpan: 1,
        classificationNameSpan: 1
      }
    ]
  ]);

  const renderTitle = (str: string) => {
    const array = str.split('\n');
    if (Array.isArray(array)) {
      return array.map((item) => {
        return <div>{item}</div>;
      });
    }
  };
  const renderColumns = (): ColumnsType<QuotePriceDetailItem> => {
    const baseColumns: ColumnsType<QuotePriceDetailItem> = [
      {
        key: 'storeName',
        title: '产品&服务',
        dataIndex: 'storeName',
        width: 170,
        render: (value, record) => {
          if (record.totalDiscounted || record.totalTransactionPrice) {
            return '';
          }
          if (record.logo) {
            return (
              <div
                style={{ display: 'flex', alignItems: 'center', minWidth: 120 }}
              >
                <Avatar
                  style={{
                    position: 'absolute',
                    left: record.hasParent ? 15 : 0
                  }}
                  src={record.logo}
                  size={32}
                  className={styles.mgr8}
                  shape={'square'}
                />
                <span style={{ marginLeft: record.hasParent ? 55 : 40 }}>
                  {value}
                </span>
              </div>
            );
          }
          return value;
        },
        onCell: (_, index) => ({
          rowSpan: _.storeTypeSpan
        })
      },
      {
        key: 'classificationName',
        title: '分类',
        dataIndex: 'classificationName',
        width: 170,
        render: (value, record) => {
          if (record.hasChildren) {
            return '';
          } else {
            if (record.totalDiscounted || record.totalTransactionPrice) {
              return '';
            }
            return <div style={{ minWidth: 100 }}>{value}</div>;
          }
        },
        onCell: (_, index) => ({
          rowSpan: _.classificationNameSpan
        })
      },
      {
        key: 'commodityName',
        title: '商品',
        dataIndex: 'commodityName',
        // width: type === 'price' ? 350 : 350,
        render: (value, record, index) => {
          if (record.hasChildren) {
            return '';
          } else {
            if (record.totalDiscounted || record.totalTransactionPrice) {
              return '';
            }
            return (
              <div style={{ minWidth: 280 }}>
                <Space style={{ color: !record.isBuy ? '#c5c7ce' : '' }}>
                  {value}
                  <Space>
                    {record.commodityDescription && (
                      <Tooltip title={renderTitle(record.commodityDescription)}>
                        <ExclamationCircleOutlined
                          style={{ color: '#C5C7CE' }}
                        />
                      </Tooltip>
                    )}
                    <span
                      style={{ color: record.isBuy ? '#808696' : '#c5c7ce' }}
                    >{`￥${record.catalogPrice}元/${record.unit}`}</span>
                  </Space>
                </Space>
              </div>
            );
          }
        }
      },
      {
        key: 'isBuy',
        title: '是否购买',
        dataIndex: 'isBuy',
        width: 95,
        align: 'center',
        render: (value, record) => {
          if (record.hasChildren) {
            return '';
          } else {
            if (record.totalDiscounted || record.totalTransactionPrice) {
              return '';
            }
            return value ? (
              <CheckCircleFilled
                style={{ fontSize: '16px', color: '#52C41A' }}
              />
            ) : (
              <CloseCircleFilled
                style={{ color: '#C5C7CE', fontSize: '16px' }}
              />
            );
          }
        }
      }
    ];
    return baseColumns.concat([
      {
        key: 'validityPeriod',
        title: '有效期',
        dataIndex: 'validityPeriod',
        width: 95,
        align: 'center',
        render: (value, record) => {
          if (record.hasChildren) {
            return '';
          } else {
            if (record.totalDiscounted || record.totalTransactionPrice) {
              return '';
            }
            if (record.isBuy) {
              if (record.pricingCycle === EPricingCycle.BUY_OUT) {
                return '买断';
              }
              const EPricingCycle_Item = [
                { name: '买断', value: EPricingCycle.BUY_OUT },
                { name: '年', value: EPricingCycle.YEAR },
                { name: '半年', value: EPricingCycle.HALF_YEAR },
                { name: '季度', value: EPricingCycle.QUARTER },
                { name: '月', value: EPricingCycle.MONTH },
                { name: '天', value: EPricingCycle.DAY }
              ];
              const findItem = EPricingCycle_Item.find(
                (item) => item.value === record.pricingCycle
              );
              if (findItem) {
                return `${value}${findItem.name}`;
              }
            }
            return <span style={{ color: '#C5C7CE' }}>--</span>;
          }
        }
      },
      {
        key: 'buyCount',
        title: '数量',
        dataIndex: 'buyCount',
        width: 100,
        render: (value, record) => {
          if (record.hasChildren) {
            return '';
          } else {
            if (record.totalDiscounted) {
              return '折扣';
            }
            if (record.totalTransactionPrice) {
              return '总计';
            }
            if (record.buyCount || record.giftCount) {
              return (
                <div>
                  <div>
                    {record.buyCount > 0 && <div>购买{record.buyCount}</div>}
                  </div>
                  <div>
                    {record.giftCount > 0 && (
                      <Space style={{ color: '#FF4D4F' }}>
                        赠送{record.giftCount}
                      </Space>
                    )}
                  </div>
                </div>
              );
            }
            return <span style={{ color: '#C5C7CE' }}>--</span>;
          }
        }
      },
      {
        key: 'price',
        title: '金额',
        dataIndex: 'price',
        width: 140,
        align: 'right',
        render: (value, record) => {
          if (record.hasChildren) {
            return '';
          } else {
            if (record.totalDiscounted) {
              return (
                <span style={{ color: '#FF4D4F', textAlign: 'right' }}>
                  -￥ {new BigNumber(value).toFormat(2)}
                </span>
              );
            } else if (record.totalTransactionPrice) {
              return (
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#17243e;'
                  }}
                >
                  ￥ {new BigNumber(value).toFormat(2)}
                </span>
              );
            } else {
              if (record.buyCount || record.giftCount) {
                return (
                  <div>
                    <div>
                      {record.buyCount > 0 && (
                        <Space size={0}>
                          <span style={{ width: 43, display: 'inline-block' }}>
                            ￥
                          </span>
                          {new BigNumber(record.buyCount)
                            .times(record.catalogPrice)
                            .toFormat(2)}
                        </Space>
                      )}
                    </div>
                    <div>{record.giftCount > 0 && <Space>￥0</Space>}</div>
                  </div>
                );
              }
              return <span style={{ color: '#C5C7CE' }}>--</span>;
            }
          }
        }
      }
    ]);
  };
  return (
    <div className={styles.pdf_page}>
      {/*<button ref={ref} type="button">*/}
      {/*  You click {value} times*/}
      {/*</button>*/}
      <div id="pdf_footer" className={styles.pdf_footer}>
        <div className={styles.pdf_footer_content}>
          <span className="current_page" style={{ marginRight: 10 }}></span>
          <span className="total_page"></span>
        </div>
      </div>
      <Button type="primary" onClick={generatePdf} loading={loading}>
        拆分pdf
      </Button>

      <Space size={10}>
        <Link to="/simple">去简单pdf</Link>
        <Link to="/span">去合并单元格的</Link>
      </Space>
      {/*<micro-app*/}
      {/*  name="umi3"*/}
      {/*  url="http://localhost:8000/"*/}
      {/*  baseroute="umitest"*/}
      {/*  default-page="/test"*/}
      {/*></micro-app>*/}
      <div id="content_pdf">
        <div id="content">
          <div
            style={{
              //marginBottom: 30,
              height: 1200,
              border: '1px solid black',
              width: '100%'
            }}
          >
            一些表头
          </div>
          <div>
            {isSplitTable ? (
              <React.Fragment>
                {tableData.map((tableDataArray, index) => {
                  if (tableDataArray.length === 0) {
                    return (
                      <Table
                        // style={{ marginBottom: 30 }}
                        // key={uuidv4()}
                        rowKey="id"
                        pagination={false}
                        dataSource={tableDataArray}
                        columns={renderColumns()}
                      />
                    );
                  }
                  const maxHeightArrayProps = maxHeightArray.filter(
                    (item) => item.tableIndex === index
                  );
                  const gapHeightArrayProps = gapHeightArray.filter(
                    (item) => item.tableIndex === index
                  );
                  console.log('gapHeightArrayProps是');
                  console.log(gapHeightArrayProps);
                  return (
                    <div style={{ marginBottom: 30 }}>
                      <SplitTableWrapper<any>
                        // key={uuidv4()}
                        columns={renderColumns()}
                        initData={tableDataArray}
                        marginTop={marginTop}
                        maxHeightArrayProps={maxHeightArrayProps.map(
                          (item) => item.data
                        )}
                        gapHeightArrayProps={gapHeightArrayProps
                          .map((item) => item.data)
                          .flat()}
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {tableData.map((array, index) => {
                  return (
                    <div style={{ marginBottom: 30 }}>
                      <NormalTable
                        tableIndex={index}
                        dataSource={array}
                        columns={renderColumns()}
                      />
                    </div>
                  );
                })}
                {/*<Table*/}
                {/*  style={{ marginBottom: 30 }}*/}
                {/*  // key={uuidv4()}*/}
                {/*  rowKey="id"*/}
                {/*  pagination={false}*/}
                {/*  dataSource={mockData2}*/}
                {/*  columns={renderColumns()}*/}
                {/*/>*/}
                {/*<Table*/}
                {/*  // key={uuidv4()}*/}
                {/*  rowKey="id"*/}
                {/*  pagination={false}*/}
                {/*  dataSource={mockData3}*/}
                {/*  columns={renderColumns()}*/}
                {/*/>*/}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default IndexPage;
