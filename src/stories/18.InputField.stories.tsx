import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import InputField from '../components/InputField';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'InputField',
  component: InputField,
};

export const Base = () => (
  <InputField
    onChangeValue={() => console.log}
    maxLength="20"
    name="Name"
    label="Name"
    placeholder="Enter token name"
  />
);
