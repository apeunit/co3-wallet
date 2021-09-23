import React from 'react';
import { Box, Flex } from 'rebass';
import TokenListItem from './TokenListItem';
import { IToken } from '../../../interfaces';
import TokenListPlaceholder from './TokenListPlaceholder';
import { useLocation } from 'react-router-dom';

const TokenList = (props: any) => {
  const location = useLocation();

  const filtered = () => {
    const list = props.tokens;
    return list
  };
  return (
    <Flex
      width="100%"
      color="text"
      flexDirection="column"
      paddingBottom="40px"
    >
      {props.tokenLoading ? (
        <TokenListPlaceholder counter={2} />
      ) : (
        <>
          <Box>
            {filtered().map((token: IToken, index: number) => {
              const newtknData =
                token.logoURL && token.logoURL.includes('description') && JSON.parse(token.logoURL);
              const newObj = newtknData
                ? { ...token, ...newtknData, logoURL: newtknData.logoURL }
                : { ...token };

              return (
                (location.pathname === '/select-token'
                  ? token.decimals > -1
                  : token.decimals > 0) && <TokenListItem {...newObj} key={index} />
              );
            })}
          </Box>
        </>
      )}
    </Flex>
  );
};

export default TokenList;
