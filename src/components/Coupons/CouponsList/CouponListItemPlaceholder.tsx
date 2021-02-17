import React from 'react';
import { Box, Flex, Image, Text } from 'rebass';

const CouponListItemPlaceholder = (props: any) => {
  return (
    <Flex flexDirection="column" backgroundColor="#fff" sx={{ flexShrink: '0' }}>
      <Box
        backgroundColor="#f0f0f0"
        sx={{ borderRadius: 8, position: 'relative', overflow: 'hidden' }}
        style={{ width: '163px', height: '163px' }}
      >
        <Image
          sx={{
            width: ['100%', '50%'],
            borderRadius: 8,
          }}
        />
        <Flex
          backgroundColor="rgba(0,0,0,.5)"
          justifyContent="center"
          alignItems="center"
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '24px',
            height: '24px',
            borderTopLeftRadius: '4px',
          }}
          fontSize="13px"
        >
          <Text className="margin: auto;" color="white" />
        </Flex>
      </Box>
      <Box padding="8px 11px 15px 9px">
        <Text
          variant="heading"
          fontSize="13px"
          height="17px"
          fontWeight="bold"
          marginBottom="4px"
          width="50px"
          backgroundColor="#f0f0f0"
        />
        <Text
          fontSize="11px"
          width="100px"
          height="17px"
          backgroundColor="#f0f0f0"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        />
      </Box>
    </Flex>
  );
};

export default CouponListItemPlaceholder;
