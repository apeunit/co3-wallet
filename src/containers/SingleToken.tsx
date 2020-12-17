import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ActionButtonGroup from '../components/ActionButtonGroup';
import TokenCard from '../components/Tokens/CreateTokens/TokenCard';
import { Flex } from 'rebass';
import STFooter from '../components/SingleTokenComponents/STFooter';
import { useTranslation } from 'react-i18next';
import ScenarioJSON from '../config/scenario.config.json';
import { fetchTokenByTicker } from 'src/redux/actions/Chain';

/**
 * TODO: Define props and state interface for component and remove all 'any(s)'
 */
const SingleToken: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  // -------------------------------------------------------------------------- */
  //                           Get data from the store                          */
  // -------------------------------------------------------------------------- */

  const { contracts, token } = useSelector(({ chain, wallet }: any) => {
    return {
      contracts: chain.contracts,
      token: wallet.transfer.token,
    };
  });

  useEffect(() => {
    if (contracts?.tokenFactory) {
      dispatch(fetchTokenByTicker(ScenarioJSON.athens.tokens[0]));
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contracts]);

  return (
    <Flex
      flexDirection="column"
      height="100vh"
      backgroundColor="blue100"
      justifyContent="space-between"
    >
      <Flex flexDirection="column" />
      <Flex flexDirection="column" paddingX={6}>
        {token && (
          <TokenCard
            key={token && token.contractAddress}
            icon={token && token.logoURL}
            loading={loading}
            name={token && token.name}
            symbol={token && (token.token_symbol || token.symbol)}
            amount={token && token.amount}
          />
        )}
        <ActionButtonGroup
          marginTop={10}
          marginBottom="auto"
          loading={loading}
          gap={2}
          buttons={[
            {
              icon: 'pay',
              label: t('multitoken.pay'),
              key: 'pay',
              iconBg: 'blue600',
              iconColor: 'white',
              onClick: () => {
                history.replace({ pathname: '/scan', state: { token } });
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
                  state: { token },
                });
              },
            },
            {
              icon: 'history',
              label: t('multitoken.history'),
              iconBorderColor: 'primary',
              iconBg: 'white',
              labelColor: 'primary',
              color: 'primary',
              className: 'txnhistory-btn',
              onClick: () => {
                history.replace('/singletxnhistory');
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
