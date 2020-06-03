import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import RadioButtonGroup from '../components/RadioButtonGroup';
import { contractsRadio } from '../containers/TokenRadioText';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'RadioButtonGroup',
  component: RadioButtonGroup,
};

export const Base = () => (
  <RadioButtonGroup
    value="Standard Contract"
    onChange={() => console.log}
    radios={contractsRadio}
  />
);
