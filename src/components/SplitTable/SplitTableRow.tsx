import React, { useRef } from 'react';
import { useUpdateEffect } from 'ahooks';

type TSplitTableRowProps = {
  id: string;
  children: React.ReactElement;
  onAddHeight: (height: number) => void;
};

const SplitTableRow: React.FC<TSplitTableRowProps> = (props) => {
  const { id, onAddHeight, children } = props;

  const ref = useRef<any>();
  useUpdateEffect(() => {
    if (ref.current) {
      const height = parseFloat(getComputedStyle(ref.current).height);
      onAddHeight(height);
    }
  }, [onAddHeight]);

  return (
    <tr ref={ref} data-row-key={id}>
      {children}
    </tr>
  );
};
export default SplitTableRow;
