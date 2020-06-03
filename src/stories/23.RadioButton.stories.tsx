import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import RadioButton from '../components/RadioButton';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'RadioButton',
  component: RadioButton,
};

export const Base = () => (
  <RadioButton
    info="lorem ipsum dolor sit amet lorem ipsum lorem lorem lorem ipsum dolor sit amet lorem ipsum"
    label="Standard Contract"
    value="Standard Contract"
    onChange={() => console.log}
  />
);
