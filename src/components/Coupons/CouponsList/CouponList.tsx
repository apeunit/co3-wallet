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
    <Box style={{ overflowY: 'auto', height: '55vh', marginBottom: '70px' }}>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" margin="0px 10px">
        {props.tokenLoading ? (
          <CouponListPlaceholder counter={3} />
        ) : (
          props.tokens
            .map((token: IToken, index: number) => {
              const newtknData = token.logoURL && token.logoURL.includes('description') && JSON.parse(token.logoURL);
              const newObj = newtknData ? {...token, ...newtknData, logoURL: newtknData.logoURL} : {...token}

              return (
                ((token.amount && token.amount > 0) || token.owner === ethAddress) &&
                parseInt(token.decimals.toString(), 10) === 0 && (
                  <CouponListItem {...newObj} key={index} />
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
