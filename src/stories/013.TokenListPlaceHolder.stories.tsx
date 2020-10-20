import React from 'react';
import { addParameters } from '@storybook/react';
import TokenListPlaceholder from '../components/Tokens/TokensList/TokenListPlaceholder';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

export default {
  title: 'TokenListPlaceHolder',
  component: TokenListPlaceholder,
};

export const Base = () => <TokenListPlaceholder counter={2} />;
