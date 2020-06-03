import React from 'react';
import { addParameters } from '@storybook/react';
import { actions } from '@storybook/addon-actions';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import QrScanner from '../components/QRScanner';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

export default {
  title: 'QrScanner',
  component: QrScanner,
};

const events = actions({
  onError: 'handle-error',
  onScan: 'handle-scan',
});

export const Base = () => <QrScanner {...events} />;
