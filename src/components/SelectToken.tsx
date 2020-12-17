import React, { useEffect, useState } from 'react';
import { Flex, Text } from 'rebass';
import { SearchHeader } from '../components/SearchHeader';
import TokenList from './Tokens/TokensList/TokenList';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/react-hooks';
import { BALANCE_NOTIFY_QUERY } from '../api/middleware';
import { IToken } from '../interfaces';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import _replace from 'lodash/replace';
import { setToAddress } from 'src/redux/actions/Wallet';

export const SelectToken: React.FC = (props: any) => {
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [tokenList, setTokenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toAddress, ethAddress } = useSelector(({ wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
      toAddress: wallet.transfer.to,
    };
  });

  const [balanceTokenQuery, { data }] = useLazyQuery(BALANCE_NOTIFY_QUERY, {
    variables: {
      accountPk: ethAddress,
    },
  });
  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const toParam = params.get('to');
      toParam && dispatch(setToAddress(_replace(toParam, /['"]+/g, '')));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search,]);

  useEffect(() => {
    if (ethAddress) {
      balanceTokenQuery();
    }
  }, [balanceTokenQuery, ethAddress]);

  useEffect(() => {
    if (data && data.balanceNotificationMany) {
      const list = data.balanceNotificationMany.filter(
        (_token: IToken) => _token.amount && _token.amount > 0,
      );
      setTokenList(list);
      setLoading(false);
    } else if (data && data.balanceNotificationMany.length === 0) {
      setLoading(false);
    }
  }, [data]);

  return (
    <Flex flexDirection="column" backgroundColor="#eff3ff" height="100vh">
      <SearchHeader back={'scan'} to={toAddress} />
      <Flex marginTop={5} className="selectTokenList">
        {!loading ? (tokenList.length > 0 ? (
          <TokenList tokens={tokenList} />
        ) : (
          <Text fontSize="1.5rem" width="100%" textAlign="center" marginY="50%">{t('payment.empty_wallet')} </Text>
        )):(
          <Text fontSize="1.25rem" width="100%" textAlign="center" marginY="50%">{t('new_crowdsale.loading')} </Text>
        )}
      </Flex>
    </Flex>
  );
};
