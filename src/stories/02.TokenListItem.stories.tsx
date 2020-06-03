import React from 'react';
import { addParameters } from '@storybook/react';
import TokenListItem from '../components/TokenListItem';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
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
  title: 'TokenListItem',
  component: TokenListItem,
  decorators: [withProvider],
};

export const Base = () => (
  <MemoryRouter>
    <TokenListItem
      image="https://assets-global.website-files.com/5cb0ac9c57054973ac1bf1e4/5cd0584a27d198a45f91afc2_3408.png"
      name="USD Coin"
      symbol="USDC"
      amount={12.5}
    />
  </MemoryRouter>
);
