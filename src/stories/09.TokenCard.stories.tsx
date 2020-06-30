import React from 'react';
import { addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TokenCard from '../components/Tokens/NewToken/TokenCard';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'TokenCard',
  component: TokenCard,
};

export const Base = () => (
  <TokenCard
    icon="https://upload.wikimedia.org/wikipedia/fr/0/00/Logo_JO_d%27%C3%A9t%C3%A9_-_Mexico_1968.png"
    name="Grocery Credit"
    symbol="GRC"
    amount={12.5}
  />
);
