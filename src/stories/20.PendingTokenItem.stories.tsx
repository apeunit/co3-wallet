import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import PendingTokenItem from '../components/SingleTokenComponents/PendingTokenItem';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../redux/configureStore';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

const store = configureStore();

const withProvider = (story: any) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'PendingTokenItem',
  component: PendingTokenItem,
  decorators: [withProvider],
};

const token = {
  name: 'ApeUnit Credit',
  symbol: 'APE',
  icon:
    'https://assets-global.website-files.com/5cb0ac9c57054973ac1bf1e4/5cd0585352e8411915dc1772_1759.png',
  description: 'Lorem ipsum dolor sit amet, consectetur ',
  contractType: 'Standard Contract',
  contract: '',
  contractLabel: '',
  tokenType: 'Mintable Token',
  totalSupply: '',
};

export const Base = () => (
  <MemoryRouter>
    <PendingTokenItem token={token} subtitle="Creating Tokens..." />
  </MemoryRouter>
);
