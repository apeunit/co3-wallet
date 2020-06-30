import React from 'react';
import { Box, Flex, Text } from 'rebass';

const TransactionHistoryListItemPlaceholder = () => {
  return (
    <>
      <Flex
        style={{ padding: '17px 20px 14px 20px' }}
        marginTop="auto"
        alignSelf="flex-end"
        alignItems="center"
        fontSize={3}
        variant="headingXl"
      >
        <Flex style={{ flexShrink: 0 }}>
          <Flex
            style={{ width: '32px', height: '32px', borderRadius: '100px', zIndex: 5 }}
            backgroundColor="shadow"
          >
            <Text
              style={{
                margin: 'auto',
              }}
              color="red"
            />
          </Flex>
          <Box
            backgroundColor="shadow"
            style={{
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              borderRadius: '40px',
              width: '30px',
              height: '30px',
              zIndex: 10,
            }}
            marginLeft="-2px"
          />
        </Flex>
        <Flex style={{ width: '100%' }} paddingLeft="8px" justifyContent="space-between">
          <Box>
            <Box width="84px" height="24px" backgroundColor="shadow"/>
            <Box width="70px" height="18px" marginTop="4px" backgroundColor="shadow"/>
          </Box>
          <Flex flexDirection="column" alignItems="flex-end">
            <Box width="45px" height="24px" backgroundColor="shadow"/>
            <Box width="30px" height="18px" marginTop="4px" backgroundColor="shadow" />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default TransactionHistoryListItemPlaceholder;
