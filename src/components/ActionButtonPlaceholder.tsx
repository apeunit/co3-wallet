import React from 'react';
import { Box, Flex } from 'rebass';
const ActionButtonPlaceholder = (props: any) => {
  return (
    <Flex flexDirection="column" alignItems="center">
      <Box
        marginX={3}
        width={56}
        height={56}
        backgroundColor="shadow"
        sx={{
          borderRadius: 'full',
        }}
      />
      <Box marginTop={3} width={56} height={10} backgroundColor="shadow" />
    </Flex>
  );
};

export default ActionButtonPlaceholder;
