import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Slider } from '../components/Slider';

addParameters({
  viewport: {
    defaultViewport: 'iphonex',
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'Slider',
  component: Slider,
};

export const Base = () => (
  <Slider
    dragEnd={() => console.log}
    onClick={() => console.log}
    title="Slide to Buy"
    bgColor="#F1F3F6"
    btnColor="blue600"
    txtColor="#8E949E"
  />
);
