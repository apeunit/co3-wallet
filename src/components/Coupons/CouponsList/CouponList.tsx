import React from 'react';
import { Box, Flex } from 'rebass';
import CouponListItem from './CouponListItem';
import { IToken } from '../../../interfaces';
import CouponListPlaceholder from './CouponListPlaceholder';

const CouponList = (props: any) => {
  return (
    <Box style={{ marginBottom: '40px' }}>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" margin="0px 10px">
        {props.tokenLoading ? (
          <CouponListPlaceholder counter={3} />
        ) : (
          props.tokens.length > 0 && props.tokens
            .map((token: IToken, index: number) => {
              const newtknData = token.logoURL && token.logoURL.includes('description') && JSON.parse(token.logoURL);
              const newObj = newtknData ? {...token, ...newtknData, logoURL: newtknData.logoURL} : {...token}

              return (
                token.decimals === 0 && (
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
