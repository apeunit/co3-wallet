import React from 'react';
import { Flex } from 'rebass';
import TokenListItemItemPlaceholder from './TokenListItemPlaceholder';
interface ITokenListPlaceHolderProps {
  // Number of list items to be display in place holder
  counter: number;
}
const TokenListPlaceholder = (props: ITokenListPlaceHolderProps) => {
  const tokenListPlaceHolders = [];
  for (let i = 0; i < props.counter; i = i + 1) {
    tokenListPlaceHolders.push(<TokenListItemItemPlaceholder key={i} />);
  }

  return (
    <Flex
      width="100%"
      color="text"
      flexDirection="column"
      maxHeight={400}
      sx={{
        overflowY: 'auto',
      }}
    >
      {tokenListPlaceHolders}
    </Flex>
  );
};

export default TokenListPlaceholder;
