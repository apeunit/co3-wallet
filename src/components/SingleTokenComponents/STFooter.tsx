import React from 'react';
import { Flex, Text } from 'rebass';
import IconButton from '../IconButton';
import '../../assets/NewToken.css';

const STFooter: React.FC = () => {
  return (
    <Flex
      height="70px"
      backgroundColor="white"
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
      paddingX={10}
      paddingTop={5}
      sx={{ borderTopWidth: '1px', borderTopColor: '#E2E8F0' }}
      style={{ position: 'relative', zIndex: 0 }}
    >
      <IconButton icon="mapIcon" />
      <IconButton icon="compareIcon" />
      <Flex
        className="token-footer-icon"
        height="40px"
        width="105px"
        backgroundColor="blue100"
        sx={{ borderRadius: 'full' }}
      >
        <IconButton paddingBottom="10px" icon="walletIcon" />
        <Text fontSize={13} marginTop="10px" color="blue600">
          Wallet
        </Text>
      </Flex>
    </Flex>
  );
};

export default STFooter;
