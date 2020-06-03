import React from 'react';
import { addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ToolBar from '../components/ToolBar';
import IconButton from '../components/IconButton';
import ToolBarTitle from '../components/ToolBarTitle';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

export default {
  title: 'ToolBar',
  component: ToolBar,
};

export const Base = () => (
  <ToolBar>
    <IconButton icon="menu" />
    <ToolBarTitle>Wallet</ToolBarTitle>
    <IconButton icon="ranking" />
    <IconButton icon="notifications" dot={true} />
  </ToolBar>
);
