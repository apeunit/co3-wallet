import React from 'react';
import PickupBasketItemPlaceholder from './PickupBasketListPlaceholder';
import { Flex } from 'rebass';

const PickupBasketListPlaceholder = (props: any) => {
  const PickupBasketListPlaceHolders = [];
  for (let i = 0; i < props.counter; i = i + 1) {
    PickupBasketListPlaceHolders.push(<PickupBasketItemPlaceholder key={i} />);
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
      {PickupBasketListPlaceHolders}
    </Flex>
  );
};

export default PickupBasketListPlaceholder;
