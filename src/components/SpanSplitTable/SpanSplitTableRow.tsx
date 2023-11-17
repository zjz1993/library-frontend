import React, { useRef } from 'react';
import { useUpdateEffect } from 'ahooks';

type TCompleteSplitTableRowProps = {
  rowKey: string;
  children: React.ReactElement;
  onAddHeight: (height: number) => void;
  record: any;
};

const SpanSplitTableRow: React.FC<TCompleteSplitTableRowProps> = (props) => {
  const { record, rowKey, onAddHeight, children } = props;
  const ref = useRef<any>();
  useUpdateEffect(() => {
    if (ref.current) {
      const height = parseFloat(getComputedStyle(ref.current).height);
      onAddHeight(height);
    }
  }, [onAddHeight]);

  return (
    <tr {...record} ref={ref}>
      {children}
    </tr>
  );
};
export default SpanSplitTableRow;
