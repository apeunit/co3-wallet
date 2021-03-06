import React from 'react';
import TransactionHistoryListItem from './TransactionHistoryListItem';
import { Box } from 'rebass';

const TransactionHistoryList = ({ transactions }: any) => {
  return (
    <Box flex="1" overflow="auto">
      <div>
        {transactions.length > 0 &&
          transactions.map((trns: any, index: number) => (
            <TransactionHistoryListItem key={index} transaction={trns} />
          ))}
      </div>
    </Box>
  );
};

export default TransactionHistoryList;
