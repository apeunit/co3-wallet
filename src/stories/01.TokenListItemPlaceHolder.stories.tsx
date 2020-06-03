import React from 'react';
import { addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TokenListItemPlaceHolder from '../components/TokenListItemPlaceholder';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'TokenListItemHolder',
  component: TokenListItemPlaceHolder,
};

export const Base = () => <TokenListItemPlaceHolder />;