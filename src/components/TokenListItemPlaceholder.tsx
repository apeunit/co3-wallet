import React from 'react';
import { Box, Flex } from 'rebass';

const TokenListItemPlaceholder = (props: any) => {
  return (
    <Flex width="100%" color="text" alignItems="center" paddingTop="14px" paddingX={7}>
      {' '}
      <Box
        width={56}
        height={56}
        backgroundColor="shadow"
        sx={{
          borderRadius: 'full',
        }}
      />
      <Flex flexDirection="column" justifyContent="center" alignItems="flex-start" paddingLeft={2}>
        <Box width={100} height={15} backgroundColor="shadow" />
        <Box marginTop={3} width={40} height={10} backgroundColor="shadow" />
      </Flex>
      <Box marginLeft="auto" width={40} height={12} backgroundColor="shadow" />
    </Flex>
  );
};

export default TokenListItemPlaceholder;
