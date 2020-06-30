import React from 'react';
import { addParameters } from '@storybook/react';
import TransactionHistoryListItem from '../components/Transactions/TransactionList/TransactionHistoryListItem';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../redux/configureStore';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

const store = configureStore();

const withProvider = (story: any) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'TransactionHistoryListItem',
  component: TransactionHistoryListItem,
  decorators: [withProvider],
};

export const Base = () => (
  <MemoryRouter>
    <TransactionHistoryListItem
      transaction={{
        to: 'George W.',
        from: '',
        price: '34.50',
        currency: 'GRG',
        timestamp: '5 February',
        status: '',
        logoUrl: 'https://www.thispersondoesnotexist.com/image',
      }}
    />
  </MemoryRouter>
);
