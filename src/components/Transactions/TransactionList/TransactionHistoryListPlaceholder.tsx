import React from 'react';
import TransactionHistoryListItemPlaceholder from './TransactionHistoryListItemPlaceholder';
import { Box } from 'rebass';

const TransactionHistoryListPlaceholder = () => {
  return (
    <Box flex="1" overflow="auto">
      <div>
        <TransactionHistoryListItemPlaceholder />
        <TransactionHistoryListItemPlaceholder />
        <TransactionHistoryListItemPlaceholder />
        <TransactionHistoryListItemPlaceholder />
        <TransactionHistoryListItemPlaceholder />
        <TransactionHistoryListItemPlaceholder />
        <TransactionHistoryListItemPlaceholder />
      </div>
    </Box>
  );
};

export default TransactionHistoryListPlaceholder;
