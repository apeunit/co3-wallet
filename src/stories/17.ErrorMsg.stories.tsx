import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import ErrorMsg from '../components/ErrorMsg';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'ErrorMsg',
  component: ErrorMsg,
};

export const Base = () => <ErrorMsg title="Name is required" type="error" />;
export const Warning = () => <ErrorMsg title="Name is required" type="warning" />;
