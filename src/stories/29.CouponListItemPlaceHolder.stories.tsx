import React from 'react';
import { addParameters } from '@storybook/react';
import CouponListItemPlaceholder from '../components/Coupons/CouponsList/CouponListItemPlaceholder';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'CouponListItemHolder',
  component: CouponListItemPlaceholder,
};

export const Base = () => <CouponListItemPlaceholder />;
