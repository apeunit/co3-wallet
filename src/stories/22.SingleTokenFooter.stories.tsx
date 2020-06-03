import React from 'react';
import { addParameters } from '@storybook/react';
import STFooter from '../components/SingleTokenComponents/STFooter';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../redux/configureStore';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

const store = configureStore();

const withProvider = (story: any) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'SingleToken Footer',
  component: STFooter,
  decorators: [withProvider],
};

export const Base = () => (
  <MemoryRouter>
    <STFooter />
  </MemoryRouter>
);
