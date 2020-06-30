import React from 'react';
import { Box, Flex } from 'rebass';
import CouponListItem from './CouponListItem';
import { IToken } from '../../../interfaces';
import CouponListPlaceholder from './CouponListPlaceholder';
import { useSelector } from 'react-redux';

const CouponList = (props: any) => {
  const { ethAddress } = useSelector(({ wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
    };
  });

  return (
    <Box style={{ overflow: 'auto', height: 'max-content', marginBottom: '80px' }}>
      <Flex alignItems="center" paddingTop="10px">
        {props.tokenLoading ? (
          <CouponListPlaceholder counter={3} />
        ) : (
          props.tokens
            .map((token: IToken, index: number) => {
              return (
                ((token.amount && token.amount > 0) || token.owner === ethAddress) &&
                parseInt(token.decimals.toString(), 10) === 0 && (
                  <CouponListItem {...token} key={index} />
                )
              );
            })
            .reverse()
        )}
      </Flex>
    </Box>
  );
};

export default CouponList;
