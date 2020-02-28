import React from 'react';
import { addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import IconButton from '../components/IconButton'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'IconButton',
  component: IconButton,
};

export const Base = () => 
    <IconButton 
      icon = "ranking"
    />

    export const Dot = () => 
    <IconButton 
      icon = "notifications"
      dot
    />

