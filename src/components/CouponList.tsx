import React from 'react';
import { Box, Flex } from 'rebass';
import CouponListItem from './CouponListItem';
import { IToken, ITokens } from '../interfaces';
import CouponListPlaceholder from './CouponListPlaceholder';
import { useSelector } from 'react-redux';

const CouponList = (props: ITokens) => {
  const { tokenLoading, ethAddress } = useSelector(({ chain, wallet }: any) => {
    return {
      tokenLoading: chain.tokenLoading,
      ethAddress: wallet.ethAddress,
    };
  });

  return (
    <Box style={{ overflow: 'auto', height: 'max-content' }}>
      <Flex alignItems="center" paddingTop="10px">
        {tokenLoading ? (
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
