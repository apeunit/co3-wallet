import React from 'react';
import CrowdsaleListItemPlaceholder from './CrowdsaleListItemPlaceholder';
import { Flex } from 'rebass';

const CrowdsaleListPlaceholder = (props: any) => {
  const crowdsaleListPlaceHolders = [];
  for (let i = 0; i < props.counter; i = i + 1) {
    crowdsaleListPlaceHolders.push(<CrowdsaleListItemPlaceholder key={i} />);
  }

  return (
    <Flex
      width="100%"
      color="text"
      flexDirection="column"
      maxHeight={400}
      sx={{
        overflowY: 'auto',
      }}
    >
      {crowdsaleListPlaceHolders}
    </Flex>
  );
};

export default CrowdsaleListPlaceholder;
