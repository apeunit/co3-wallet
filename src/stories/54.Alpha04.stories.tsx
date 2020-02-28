import React from 'react';
import { addParameters } from '@storybook/react';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import ToolBar from '../components/ToolBar'
import InfoBar from '../components/InfoBar'
import IconButton from '../components/IconButton'
import ToolBarTitle from '../components/ToolBarTitle'
import Badge from '../components/Badge'
import AvatarBadge from '../components/AvatarBadge'
import Keyboard from '../components/Keyboard'

import { Flex, Text } from 'rebass'

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

export default {
  title: 'Alpha04',
  component: ToolBar,
};

export const Screen04 = () => {
  return(
    <Flex
      flexDirection="column"
      height='100vh' 
    >
        <ToolBar>
            <IconButton icon = "back"/>
            <ToolBarTitle>
              Send
            </ToolBarTitle>
        </ToolBar>

        <InfoBar border>
            <Text variant ="base">To</Text>
            <AvatarBadge
                image='https://www.thispersondoesnotexist.com/image'
                label='0x32Be343B94f860124dC4fEe278FDCBD38C102D88'
            />
        </InfoBar>

        <InfoBar>
            <Badge>GRC</Badge>
            <AvatarBadge
                image='https://upload.wikimedia.org/wikipedia/fr/0/00/Logo_JO_d%27%C3%A9t%C3%A9_-_Mexico_1968.png'
                label='Grocery Credit'
            />
        </InfoBar>

        <Text
            marginTop='auto'
            alignSelf='flex-end'
            paddingX={7}
            paddingY={8}
            variant='headingX2l'>
          25.8
        </Text>

        <Keyboard
            marginBottom={10}
        />

      
    </Flex>
    )
}