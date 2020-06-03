import React, { useEffect } from 'react';
import { Flex } from 'rebass';
import { SearchHeader } from '../components/SearchHeader';
import TokenList from '../components/TokenList';
import { useDispatch, useSelector } from 'react-redux';
import { loadTokenBalanceByList } from '../redux/actions/Chain';
import _merge from 'lodash/merge';

export const SelectToken: React.FC = (props: any) => {
  const { token } = props;
  const { tokenList, ethAddress, tokenBalance, toAddress } = useSelector(
    ({ chain, wallet }: { chain: any; wallet: any; tokenBalance: any; address: any }) => {
      return {
        tokenList: chain.tokenList,
        ethAddress: wallet.ethAddress,
        toAddress: wallet.transfer.to,
        tokenBalance: chain.tokenBalance,
      };
    },
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (tokenList.length > 0) {
      // Load user balance for all the tokens return from TokenFactory.
      // If the env is development set the owner address to
      // `devAddress` define in env else provide the memonic address to the  `loadTokenBalanceByList`
      dispatch(loadTokenBalanceByList(tokenList, ethAddress));
      tokenList.map((_token: any) =>
        _merge(_token, {
          image: _token.logoURL,
        }),
      );
    }
  }, [tokenList, ethAddress, dispatch]);

  useEffect(() => {
    if (tokenList.length === Object.keys(tokenBalance).length) {
      // TokenList only containts the token information.
      // So  we need to update the tokenlist with Balance and Image url.
      tokenList.map((_token: any) =>
        _merge(_token, {
          amount: tokenBalance[_token.symbol].balance,
        }),
      );
    }
  }, [token, tokenBalance, tokenList]);

  return (
    <Flex flexDirection="column" backgroundColor="#eff3ff" height="100vh">
      <SearchHeader
        back={'scan'}
        to={toAddress || '0x32Be343B94f860124dC4fEe278FDCBD38C102D88...'}
      />
      <Flex marginTop={5}>
        <TokenList tokens={tokenList} />
      </Flex>
    </Flex>
  );
};
