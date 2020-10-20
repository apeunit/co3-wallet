import React from 'react';
import { addParameters } from '@storybook/react';
import CrowdsaleListItem from '../components/Crowdsale/CrowdsaleList/CrowdsaleListItem';
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
  title: 'CrowdsaleListItem',
  component: CrowdsaleListItem,
  decorators: [withProvider],
};

export const Base = () => (
  <MemoryRouter>
    <CrowdsaleListItem
      crowdsale={{
        crowdsaleId: '_oqqfov1fd',
        icon: 'https://www.biggerbolderbaking.com/wp-content/uploads/2018/05/1C5A7434.jpg',
        name: 'Strawberry Ice Cream',
        description: 'Greyhound divisively hello coldly wonderfully testing ice cream',
        giveRatio: 5,
        itemToSell: 'APC',
        contractAddress: '0x52B2FA0DbF9096198DA4E580390A030f09F701d5',
        token: 'APC',
      }}
      tokenList={[
        {
          logoURL:
            'https://assets-global.website-files.com/5cb0ac9c57054973ac1bf1e4/5cd0585352e8411915dc1772_1759.png',
          name: 'Status',
          token_symbol: 'SNT',
          decimals: 2,
          amount: 2.75,
        },
        {
          logoURL:
            'https://assets-global.website-files.com/5cb0ac9c57054973ac1bf1e4/5cd0584a27d198a45f91afc2_3408.png',
          name: 'USD Coin',
          token_symbol: 'USDC',
          decimals: 2,
          amount: 12.5,
        },
      ]}
    />
  </MemoryRouter>
);
