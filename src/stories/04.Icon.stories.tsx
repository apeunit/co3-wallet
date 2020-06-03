import React from 'react';
import { addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Icon from '../components/Icon';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'Icon',
  component: Icon,
};

export const Base = () => <Icon name="pay" />;
