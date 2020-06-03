import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import TextArea from '../components/TextArea';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'TextArea',
  component: TextArea,
};

export const Base = () => <TextArea maxLength="100" />;
