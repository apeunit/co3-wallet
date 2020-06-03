import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ToolBar from '../components/ToolBar';
import IconButton from '../components/IconButton';
import ToolBarTitle from '../components/ToolBarTitle';
import ActionButtonGroup from '../components/ActionButtonGroup';
import TokenCard from '../components/TokenCard';
import { Flex } from 'rebass';
import { loadTokenBalanceByList } from '../redux/actions/Chain';
import _merge from 'lodash/merge';
import STFooter from '../components/SingleTokenComponents/STFooter';
import { setTransferToken } from '../redux/actions/Wallet';
import { IToken } from '../interfaces';

/**
 * TODO: Define props and state interface for component and remove all 'any(s)'
 */
const SingleToken: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [token, setToken] = useState<IToken>();

  // -------------------------------------------------------------------------- */
  //                           Get data from the store                          */
  // -------------------------------------------------------------------------- */

  const { tokenLoading, tokenList, ethAddress, tokenBalance } = useSelector(
    ({ chain, wallet }: { chain: any; wallet: any; tokenBalance: any }) => {
      return {
        tokenList: chain.tokenList,
        ethAddress: wallet.ethAddress,
        tokenBalance: chain.tokenBalance,
        tokenLoading: chain.tokenLoading,
      };
    },
  );

  useEffect(() => {
    if (tokenList.length > 0) {
      // Load user balance for all the tokens return from TokenFactory.
      // If the env is development set the owner address to
      // `devAddress` define in env else provide the memonic address to the  `loadTokenBalanceByList`
      dispatch(loadTokenBalanceByList(tokenList, ethAddress));
      tokenList.map((token: any) =>
        _merge(token, {
          image: token.logoURL,
        }),
      );
    }
  }, [dispatch, ethAddress, tokenList]);

  useEffect(() => {
    if (
      Object.keys(tokenBalance).length > 0 &&
      tokenList.length === Object.keys(tokenBalance).length
    ) {
      // TokenList only containts the token information.
      // So  we need to update the tokenlist with Balance and Image url.
      tokenList.map((_token: IToken) => {
        if (tokenBalance[_token.symbol] && tokenBalance[_token.symbol].balance > 0) {
          dispatch(setTransferToken(_token));
          setToken(_token);
        }

        return _merge(_token, {
          amount: tokenBalance[_token.symbol] && tokenBalance[_token.symbol].balance,
        });
      });
      if (!token) {
        dispatch(setTransferToken(tokenList[0]));
        setToken(tokenList[0]);
      }
      // --------------------------------------------------------------------------
    }
  }, [dispatch, token, tokenBalance, tokenList]);

  return (
    <Flex
      flexDirection="column"
      height="100vh"
      backgroundColor="blue100"
      justifyContent="space-between"
    >
      <Flex flexDirection="column">
        <ToolBar>
          <IconButton icon="menu" />
          <ToolBarTitle>Wallet</ToolBarTitle>
          <IconButton icon="ranking" />
          <IconButton icon="notifications" dot={true} />
        </ToolBar>
      </Flex>
      <Flex flexDirection="column" paddingX={6}>
        {token && (
          <TokenCard
            key={token && token.contractAddress}
            loading={tokenList === undefined || tokenLoading}
            icon={token && token.image}
            name={token && token.name}
            symbol={token && token.symbol}
            amount={token && token.amount}
          />
        )}
        <ActionButtonGroup
          marginTop={10}
          marginBottom="auto"
          gap={2}
          loading={tokenList === undefined || tokenLoading}
          buttons={[
            {
              icon: 'pay',
              label: 'Pay',
              key: 'pay',
              iconBg: 'blue600',
              iconColor: 'white',
              onClick: () => {
                history.replace({ pathname: '/scan', state: { token: tokenList && tokenList[0] } });
              },
            },
            {
              icon: 'receive',
              label: 'Receive',
              key: 'receive',
              iconBg: 'blue600',
              iconColor: 'white',
              onClick: () => {
                history.replace({
                  pathname: '/receive',
                  state: { token: tokenList && tokenList[0] },
                });
              },
            },
            {
              icon: 'history',
              label: 'History',
              key: 'history',
              iconBg: 'white',
              iconColor: 'blue600',
              iconBorderColor: 'blue600',
              onClick: () => {
                history.replace('/history');
              },
            },
          ]}
        />
      </Flex>
      <Flex flexDirection="column">
        <STFooter />
      </Flex>
    </Flex>
  );
};

export default SingleToken;
