import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../redux/configureStore';
import CouponImageCard from '../components/Coupons/CreateCoupon/CouponImageCard';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

const store = configureStore();

const withProvider = (story: any) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'CouponImageCard',
  component: CouponImageCard,
  decorators: [withProvider],
};

const coupon = {
  name: 'ApeUnit Credit Coupon',
  symbol: 'APE',
  icon:
    'https://assets-global.website-files.com/5cb0ac9c57054973ac1bf1e4/5cd0585352e8411915dc1772_1759.png',
  description: 'Lorem ipsum dolor sit amet, consectetur ',
};

export const Base = () => (
  <MemoryRouter>
    <CouponImageCard
      coupon={coupon}
      handleChangeIcon={() => console.log}
      uploading={false}
      error=""
      icon={coupon.icon}
    />
  </MemoryRouter>
);
