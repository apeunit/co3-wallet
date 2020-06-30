import React from 'react';
import { addParameters } from '@storybook/react';
import TransactionHistoryListItemPlaceholder from '../components/Transactions/TransactionList/TransactionHistoryListItemPlaceholder';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'TransactionHistoryListItemPlaceholder',
  component: TransactionHistoryListItemPlaceholder,
};

export const Base = () => <TransactionHistoryListItemPlaceholder />;
