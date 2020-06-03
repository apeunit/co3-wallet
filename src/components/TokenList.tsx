import React from 'react';
import { Box, Flex } from 'rebass';
import TokenListItem from './TokenListItem';
import { IToken, ITokens } from '../interfaces';
import TokenListPlaceholder from './TokenListPlaceholder';
import { useSelector } from 'react-redux';

const TokenList = (props: ITokens) => {
  const { tokenLoading, ethAddress } = useSelector(({ chain, wallet }: any) => {
    return {
      tokenLoading: chain.tokenLoading,
      ethAddress: wallet.ethAddress,
    };
  });

  return (
    <Flex
      width="100%"
      color="text"
      flexDirection="column"
      maxHeight={props.tokens.find((tkn) => tkn.decimals == 0) ? 155 : 280}
      sx={{
        overflowY: 'auto',
      }}
    >
      {tokenLoading ? (
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
