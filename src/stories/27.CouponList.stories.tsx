import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../redux/configureStore';
import CouponList from '../components/Coupons/CouponsList/CouponList';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

const store = configureStore();

const withProvider = (story: any) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'CouponList',
  component: CouponList,
  decorators: [withProvider],
};

export const Base = () => (
  <MemoryRouter>
    <CouponList
      tokens={[
        {
          logoURL:
            'https://assets-global.website-files.com/5cb0ac9c57054973ac1bf1e4/5cd0585352e8411915dc1772_1759.png',
          name: 'Status Coupon',
          token_symbol: 'SNT',
          decimals: 0,
          amount: 2.75,
        },
        {
          logoURL:
            'https://assets-global.website-files.com/5cb0ac9c57054973ac1bf1e4/5cd0584a27d198a45f91afc2_3408.png',
          name: 'USD Coin Coupon',
          token_symbol: 'USDC',
          decimals: 0,
          amount: 12.5,
        },
      ]}
    />
  </MemoryRouter>
);
