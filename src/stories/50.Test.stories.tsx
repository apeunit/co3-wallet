import React from 'react';
import { addParameters } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import ToolBar from '../components/ToolBar'
import IconButton from '../components/IconButton'
import ToolBarTitle from '../components/ToolBarTitle'
import ActionButtonGroup from '../components/ActionButtonGroup'
import TokenList from '../components/TokenList'
import {Box, Flex} from 'rebass'

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

export default {
  title: 'Test',
  component: ToolBar,
};

export const Base = () => {
  return(
    <Flex
      flexDirection="column"
      height='100vh'
      backgroundColor='primary'
      color='background'
    >
      <ToolBar>
          <IconButton icon = "menu"/>
          <ToolBarTitle>
              Wallet
          </ToolBarTitle>
          <IconButton icon = "ranking"/>
          <IconButton icon = "notifications" dot/>
      </ToolBar>
      <ActionButtonGroup
      marginTop={9}

      buttons={[
          {
              icon: "pay",
              label: "Pay"
          },
          {
              icon: "receive",
              label: "Receive"
          },
          {
              icon: "history",
              label: "History"
          }
      ]}
      />
      <Box
        marginTop={7}
        backgroundColor='background'
        paddingTop={8}
        sx={{
          borderTopLeftRadius:'r10',
          borderTopRightRadius:'r10',
          flexGrow:1
        }}
      >
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
        
      </Box>
    </Flex>
    )
}