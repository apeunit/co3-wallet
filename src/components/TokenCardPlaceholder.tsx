import React from 'react';
import { Box, Flex, Image, Text } from 'rebass';
import chip from '../images/chip.png';
import Avatar from './Avatar';

const TokenCardPlaceholder = (props: any) => {
  const { type } = props;

  return (
    <>
      <Flex width="100%" justifyContent="flex-end">
        <Flex flexDirection="column" alignItems="flex-end" paddingLeft={2}>
          <Text
            fontFamily="sans"
            fontSize={3}
            fontWeight="light"
            backgroundColor="gray"
            textAlign="right"
            height="16px"
            width="120px"
            sx={{
              letterSpacing: 'xNarrow',
              marginBottom: 2,
            }}
          >
            {' '}
          </Text>
          <Box marginY={1} backgroundColor="gray" height="9px" width="56px"/>
        </Flex>
      </Flex>

      <Flex alignItems="flex-start" width="100%">
        <Image width="50px" src={chip} />
      </Flex>

      <Flex justifyContent="space-between" width="100%">
        {type !== 'add' && (
          <Flex
            flexDirection="column"
            color="#5B5D63"
            justifyContent="center"
            alignItems="flex-start"
          >
            <Text
              fontSize={3}
              width="52px"
              height="16px"
              backgroundColor="gray"
              fontWeight="500"
              textAlign="left"
            >
              {' '}
            </Text>
            <Text
              fontSize={1}
              width="40px"
              height="9px"
              marginTop={3}
              backgroundColor="gray"
              fontWeight="regular"
              textAlign="left"
            >
              {' '}
            </Text>
          </Flex>
        )}
        <Avatar
          marginRight="10px"
          backgroundColor="gray"
          borderRadius="50px"
          border="none"
          size="55px"
          justifyContent="flex-end"
        />
      </Flex>
    </>
  );
};

export default TokenCardPlaceholder;
