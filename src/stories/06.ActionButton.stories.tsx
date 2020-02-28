import React from 'react';
import { addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ActionButton from '../components/ActionButton'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'ActionButton',
  component: ActionButton,
};

export const Base = () => 
    <ActionButton 
      icon = "pay"
      label = "Pay"
    />

