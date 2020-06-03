import React from 'react';
import { Flex } from 'rebass';
import CouponListItemPlaceholder from './CouponListItemPlaceholder';
interface ICouponListPlaceHolderProps {
  // Number of list items to be display in place holder
  counter: number;
}

const CouponListPlaceholder = (props: ICouponListPlaceHolderProps) => {
  const couponListPlaceHolders = [];
  for (let i = 0; i < props.counter; i = i + 1) {
    couponListPlaceHolders.push(<CouponListItemPlaceholder key={i} />);
  }

  return (
    <Flex
      width="100%"
      color="text"
      maxHeight={400}
      sx={{
        overflowY: 'auto',
      }}
    >
      {couponListPlaceHolders}
    </Flex>
  );
};

export default CouponListPlaceholder;
