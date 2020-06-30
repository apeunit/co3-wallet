import React from 'react';
import { Box, Flex } from 'rebass';
import TokenListItem from './TokenListItem';
import { IToken } from '../../../interfaces';
import TokenListPlaceholder from './TokenListPlaceholder';
import { useSelector } from 'react-redux';

const TokenList = (props: any) => {
  const { ethAddress } = useSelector(({ wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
    };
  });

  return (
    <Flex
      width="100%"
      color="text"
      flexDirection="column"
      maxHeight={
        props.tokens.find((tkn: IToken) => parseInt(tkn.decimals.toString(), 10) === 0) ? 155 : 280
      }
      sx={{
        overflowY: 'auto',
      }}
    >
      {props.tokenLoading ? (
        <TokenListPlaceholder counter={2} />
      ) : (
        <Box>
          {props.tokens
            .map((token: IToken, index: number) => {
              return (
                ((token.amount && token.amount > 0) || token.owner === ethAddress) &&
                token.decimals > 0 && <TokenListItem {...token} key={index} />
              );
            })
            .reverse()}
        </Box>
      )}
    </Flex>
  );
};

export default TokenList;
