import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import AddImage from '../components/AddImage';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'AddImage',
  component: AddImage,
};

export const Base = () => (
  <AddImage
    label={'Upload contract'}
    accept="application/pdf"
    icon={'cloud'}
    onChange={() => console.log}
    placeholder={''}
    padding={6}
    marginLeft={20}
  />
);

export const TokenContract = () => (
  <AddImage
    label="Ape_Credit_Contract.pdf"
    icon={'clouddone'}
    onChange={() => console.log}
    placeholder={''}
    padding={6}
    marginLeft={20}
  />
);
