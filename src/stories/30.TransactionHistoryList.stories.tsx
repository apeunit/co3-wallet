import React from 'react';
import { addParameters } from '@storybook/react';
import TransactionHistoryList from '../components/TransactionHistoryList';
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
  title: 'TransactionHistoryList',
  component: TransactionHistoryList,
  decorators: [withProvider],
};

export const Base = () => (
  <MemoryRouter>
    <TransactionHistoryList
      transactions={[
        {
          to: 'George W.',
          from: '',
          price: '34.50',
          currency: 'GRG',
          timestamp: '5 February',
          status: '',
          logoUrl: 'https://www.thispersondoesnotexist.com/image',
        },
        {
          to: '',
          from: 'Andrea W.',
          price: '12.50',
          currency: 'GRG',
          timestamp: '17 February',
          status: '',
          logoUrl: 'https://www.thispersondoesnotexist.com/image',
        },
      ]}
    />
  </MemoryRouter>
);
