import React, { useState } from 'react';
import { Box, Flex } from 'rebass';
import TokenListItem from './TokenListItem';
import { IToken } from '../../../interfaces';
import TokenListPlaceholder from './TokenListPlaceholder';
import { useLocation } from 'react-router-dom';
import IconButton from '../../IconButton';

const TokenList = (props: any) => {
  const location = useLocation();

  const [expand, setExpand] = useState(false);
  const filtered = () => {
    const list = props.tokens;
    if (expand) return list;
    return list.slice(0, 2);
  };
  return (
    <Flex
      width="100%"
      color="text"
      flexDirection="column"
      // maxHeight={
      //   props.tokens.find((tkn: IToken) => (tkn.purpose === TOKEN_PURPOSE)) ? 160 : 280
      // }
      // sx={{
      //   overflowY: 'auto',
      // }}
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
          {props.tokens && props.tokens.length > 2 && (
            <Flex width="100%" justifyContent="center">
              <IconButton
                onClick={() => setExpand(!expand)}
                display="inline-block"
                icon={!expand ? 'arrowDown' : 'arrowUp'}
              />
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};

export default TokenList;
