import React from 'react';
import { Box, Flex } from 'rebass';
import { Divider } from '@material-ui/core';

const CrowdsaleListItemPlaceholder = (props: any) => {
  return (
    <Flex marginTop="10px" width="100%" paddingX={5} flexDirection="row">
      <Flex marginRight="15px" justifyContent="start">
        <Box width={110} height={75} backgroundColor="shadow" />
      </Flex>
      <Flex flexDirection="column" width="70%">
        <Flex marginBottom="15px" justifyContent="space-between" width="100%">
          <Flex flexDirection="column">
            <Box width={165} height={15} backgroundColor="shadow" marginTop={15} />
            <Box width={165} height={15} backgroundColor="shadow" marginTop={5} />
          </Flex>
          <Box marginLeft="auto" width={40} height={12} marginTop={5} backgroundColor="shadow" />
        </Flex>
        <Divider />
      </Flex>
    </Flex>
  );
};

export default CrowdsaleListItemPlaceholder;
