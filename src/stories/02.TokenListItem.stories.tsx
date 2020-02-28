import React from 'react';
import { addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TokenListItem from '../components/TokenListItem'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'TokenListItem',
  component: TokenListItem,
};

export const Base = () => 
    <TokenListItem 
        image='https://assets-global.website-files.com/5cb0ac9c57054973ac1bf1e4/5cd0584a27d198a45f91afc2_3408.png' 
        name="USD Coin"
        symbol="USDC"
        amount={12.50}
    />

