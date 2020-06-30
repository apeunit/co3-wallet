import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import ToolBar from '../components/ToolBar';
import IconButton from '../components/IconButton';
import ToolBarTitle from '../components/ToolBarTitle';
import ActionButtonGroup from '../components/ActionButtonGroup';
import TokenList from '../components/Tokens/TokensList/TokenList';
import { Box, Flex } from 'rebass';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../redux/configureStore';

const store = configureStore();

const withProvider = (story: any) => <Provider store={store}>{story()}</Provider>;

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

export default {
  title: 'Test',
  component: ToolBar,
  decorators: [withProvider],
};

export const Base = () => {
  return (
    <MemoryRouter>
      <Flex flexDirection="column" height="100vh" backgroundColor="primary" color="background">
        <ToolBar>
          <IconButton icon="menu" />
          <ToolBarTitle>Wallet</ToolBarTitle>
          <IconButton icon="ranking" />
          <IconButton icon="notifications" dot={true} />
        </ToolBar>
        <ActionButtonGroup
          marginTop={9}
          buttons={[
            {
              icon: 'pay',
              label: 'Pay',
            },
            {
              icon: 'receive',
              label: 'Receive',
            },
            {
              icon: 'history',
              label: 'History',
            },
          ]}
        />
        <Box
          marginTop={7}
          backgroundColor="background"
          paddingTop={8}
          sx={{
            borderTopLeftRadius: 'r10',
            borderTopRightRadius: 'r10',
            flexGrow: 1,
          }}
        >
          <TokenList
            tokens={[
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
        </Box>
      </Flex>
    </MemoryRouter>
  );
};
