import React from 'react';
import { addParameters } from '@storybook/react';
import CrowdsaleList from '../components/Crowdsale/CrowdsaleList/CrowdsaleList';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../redux/configureStore';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

const store = configureStore();

const withProvider = (story: any) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'CrowdsaleList',
  component: CrowdsaleList,
  decorators: [withProvider],
};

export const Base = () => (
  <MemoryRouter>
    <CrowdsaleList
      limit={20}
      fetchMore={console.log}
      crowdsaleList={[
        {
          crowdsaleId: '_oqqfov1fd',
          icon: 'https://www.biggerbolderbaking.com/wp-content/uploads/2018/05/1C5A7434.jpg',
          name: 'Strawberry Ice Cream',
          description: 'Greyhound divisively hello coldly wonderfully testing ice cream',
          giveRatio: 5,
          itemToSell: 'APC',
          contractAddress: '0x52B2FA0DbF9096198DA4E580390A030f09F701d5',
          token: 'APC',
        },
        {
          crowdsaleId: '_gumvnglh8',
          icon:
            'https://www.budgetbytes.com/wp-content/uploads/2013/07/Creamy-Tomato-Spinach-Pasta-V2-bowl.jpg',
          name: 'Pasta Lunch!',
          description: 'Greyhound divisively hello coldly wonderfully testing ice cream',
          giveRatio: 5,
          itemToSell: 'APC',
          contractAddress: '0xF927A5C577Da3A11d853060Dab848eaf6AC3Cf72',
          token: 'USDC',
        },
      ]}
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
