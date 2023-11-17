import React from 'react';

type TSplitTableRowProps = {
  id: string;
  children: React.ReactElement;
  tableIndex: number;
};

const NormalTableRow: React.FC<TSplitTableRowProps> = (props) => {
  const { tableIndex, id, children } = props;

  return (
    <tr data-row-key={id} data-table-index={tableIndex}>
      {children}
    </tr>
  );
};
export default NormalTableRow;
