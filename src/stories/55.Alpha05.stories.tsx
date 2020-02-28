import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Flex, Text, Button} from 'rebass'

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

export default {
  title: 'Alpha05'
};

export const Base = () => 
    <Flex
        justifyContent='center'
        alignItems='flex-end'
        size='100%'
        backgroundColor='overlay20'
        sx={{
            position: 'fixed'
        }}
    >
        <Flex
            flexDirection='column'
            backgroundColor='white'
            width='100%'
            paddingY={8}
            paddingX={7}        
            sx={{
                borderTopLeftRadius:'r10',
                borderTopRightRadius:'r10',
                boxShadow: 'base'
              }}
        >
            <Text variant="heading" textAlign='center' mt={7}>
                Lorem ipsum
            </Text>
            <Text variant="base" textAlign='center' marginTop={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus consequat ante, vitae rutrum libero
            </Text>
           
            <Button variant='ghost' marginX='auto' mt={5}>Okay</Button>

        </Flex>

    </Flex>

