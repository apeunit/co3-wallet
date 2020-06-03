import React from 'react';
import { addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ActionButtonPlaceholder from '../components/ActionButtonPlaceholder';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'ActionButtonPlaceholder',
  component: ActionButtonPlaceholder,
};

export const Base = () => <ActionButtonPlaceholder />;
