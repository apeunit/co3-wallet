import React from 'react';
import { addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ActionButtonGroup from '../components/ActionButtonGroup';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

export default {
  title: 'ActionButtonGroup',
  component: ActionButtonGroup,
};

export const Base = () => (
  <ActionButtonGroup
    buttons={[
      {
        icon: 'pay',
        label: 'Pay',
      },
      {
        icon: 'receive',
        label: 'Receive',
      },
      {
        icon: 'history',
        label: 'History',
      },
    ]}
  />
);
