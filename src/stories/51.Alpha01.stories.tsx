import React from 'react';
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import ToolBar from '../components/ToolBar';
import IconButton from '../components/IconButton';
import ToolBarTitle from '../components/ToolBarTitle';
import ActionButtonGroup from '../components/ActionButtonGroup';
import TokenCard from '../components/Tokens/CreateTokens/TokenCard';
import { Box, Flex, Text } from 'rebass';
import { motion, useMotionValue, useTransform } from 'framer-motion';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'iphonex',
  },
});

export default {
  title: 'Alpha01',
  component: ToolBar,
};

export const Screen01 = () => {
  const cardY = useMotionValue(0);
  const buttonGroupY = useTransform(cardY, (value) => value / 2);

  return (
    <Flex flexDirection="column" height="100vh" backgroundColor="blue100">
      <ToolBar>
        <IconButton icon="menu" />
        <ToolBarTitle>Wallet</ToolBarTitle>
        <IconButton icon="ranking" />
        <IconButton icon="notifications" dot={true} />
      </ToolBar>
      <motion.div
        style={{
          marginTop: 'auto',
          y: cardY,
          zIndex: 100,
        }}
        drag="y"
        dragElastic={0.2}
        dragConstraints={{
          top: 0,
          bottom: 0,
        }}
      >
        <TokenCard
          icon="https://upload.wikimedia.org/wikipedia/fr/0/00/Logo_JO_d%27%C3%A9t%C3%A9_-_Mexico_1968.png"
          name="Grocery Credit"
          symbol="GRC"
          amount={12.5}
          marginX={7}
        />
      </motion.div>
      <motion.div
        style={{
          marginBottom: 'auto',
          y: buttonGroupY,
        }}
      >
        <ActionButtonGroup
          justifyContent="center"
          marginTop={9}
          marginBottom="auto"
          gap={4}
          iconColor="blue600"
          iconBg="blue200"
          buttons={[
            {
              icon: 'pay',
              label: 'Pay',
            },
            {
              icon: 'receive',
              label: 'Receive',
            },
          ]}
        />
      </motion.div>
      <Box
        backgroundColor="background"
        paddingTop={10}
        paddingX={7}
        height="s40"
        sx={{
          borderTopLeftRadius: 'r10',
          borderTopRightRadius: 'r10',
          boxShadow: 'base',
        }}
      >
        <Text
          fontFamily="sans"
          fontSize={2}
          fontWeight="regular"
          color="text"
          sx={{
            letterSpacing: 'xNarrow',
            marginBottom: 2,
          }}
        >
          Transaction History
        </Text>
      </Box>
    </Flex>
  );
};
