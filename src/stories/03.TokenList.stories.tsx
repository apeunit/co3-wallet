import React from 'react';
import { addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TokenList from '../components/TokenList'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

export default {
  title: 'TokenList',
  component: TokenList,
};

export const Base = () => 
    <TokenList
        tokens={[
            {
                image:'https://assets-global.website-files.com/5cb0ac9c57054973ac1bf1e4/5cd0585352e8411915dc1772_1759.png',
                name:"Status",
                symbol:"SNT",
                amount:2.75
            },
            {
                image:'https://assets-global.website-files.com/5cb0ac9c57054973ac1bf1e4/5cd0584a27d198a45f91afc2_3408.png', 
                name:"USD Coin",
                symbol:"USDC",
                amount:12.50
            }
        ]}
    />

