import React from 'react';
import { Box, Flex } from 'rebass';
import TokenListItem from './TokenListItem';
import { IToken } from '../../../interfaces';
import TokenListPlaceholder from './TokenListPlaceholder';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { TOKEN_PURPOSE } from 'src/config';

const TokenList = (props: any) => {
  const location = useLocation();
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
        props.tokens.find((tkn: IToken) => (tkn.purpose === TOKEN_PURPOSE)) ? 160 : 280
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
              const newtknData = token.logoURL && token.logoURL.includes('description') && JSON.parse(token.logoURL);
              const newObj = newtknData ? {...token, ...newtknData, logoURL: newtknData.logoURL} : {...token}
    
              return (
                token.owner === ethAddress &&
                (location.pathname === '/select-token' ? token.decimals > -1 : token.decimals > 0 ) && <TokenListItem {...newObj} key={index} />
              );
            })
            .reverse()}
        </Box>
      )}
    </Flex>
  );
};

export default TokenList;
