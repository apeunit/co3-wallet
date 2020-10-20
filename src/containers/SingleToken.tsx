import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ToolBar from '../components/ToolBar';
import IconButton from '../components/IconButton';
import ToolBarTitle from '../components/ToolBarTitle';
import ActionButtonGroup from '../components/ActionButtonGroup';
import TokenCard from '../components/Tokens/CreateTokens/TokenCard';
import { Flex } from 'rebass';
import STFooter from '../components/SingleTokenComponents/STFooter';
import { setTransferToken } from '../redux/actions/Wallet';
import { IToken } from '../interfaces';
import { useLazyQuery } from '@apollo/react-hooks';
import { BALANCE_NOTIFY_QUERY } from './query';
import { useTranslation } from 'react-i18next';

/**
 * TODO: Define props and state interface for component and remove all 'any(s)'
 */
const SingleToken: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [token, setToken] = useState<IToken>();
  const [tokenList, setTokenList] = useState([]);
  // -------------------------------------------------------------------------- */
  //                           Get data from the store                          */
  // -------------------------------------------------------------------------- */

  const { ethAddress } = useSelector(({ wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
    };
  });

  const [balanceTokenQuery, { loading, data }] = useLazyQuery(BALANCE_NOTIFY_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      accountPk: ethAddress,
    },
  });

  useEffect(() => {
    if (ethAddress) {
      balanceTokenQuery();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethAddress]);

  useEffect(() => {
    if (data) {
      setTokenList(data.balanceNotificationMany);
    }
  }, [data]);

  useEffect(() => {
    if (!token && tokenList.length > 0) {
      dispatch(setTransferToken(tokenList[0]));
      setToken(tokenList[0]);
    }
  }, [dispatch, token, tokenList]);

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
          <ToolBarTitle>{t('multitoken.label')}</ToolBarTitle>
        </ToolBar>
      </Flex>
      <Flex flexDirection="column" paddingX={6}>
        {token && (
          <TokenCard
            key={token && token.contractAddress}
            loading={tokenList === undefined || loading}
            icon={token && token.logoURL}
            name={token && token.name}
            symbol={token && token.token_symbol}
            amount={token && token.amount}
          />
        )}
        <ActionButtonGroup
          marginTop={10}
          marginBottom="auto"
          gap={2}
          loading={tokenList === undefined || loading}
          buttons={[
            {
              icon: 'pay',
              label: t('multitoken.pay'),
              key: 'pay',
              iconBg: 'blue600',
              iconColor: 'white',
              onClick: () => {
                history.replace({ pathname: '/scan', state: { token: tokenList && tokenList[0] } });
              },
            },
            {
              icon: 'receive',
              label: t('multitoken.receive'),
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
              label: t('multitoken.history'),
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
        <STFooter iconActive="walletIcon" />
      </Flex>
    </Flex>
  );
};

export default SingleToken;
