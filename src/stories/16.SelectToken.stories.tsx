import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { SelectToken } from '../components/SelectToken';
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
  title: 'SelectToken',
  component: SelectToken,
  decorators: [withProvider],
};

export const Base = () => (
  <MemoryRouter>
    <SelectToken />
  </MemoryRouter>
);
