import React, { useEffect, useState } from 'react';
import { Flex, Text } from 'rebass';
import TransactionHistoryList from '../components/Transactions/TransactionList/TransactionHistoryList';
import TransactionHistoryListPlaceholder from '../components/Transactions/TransactionList/TransactionHistoryListPlaceholder';
import { fetchTransactionsHistory } from '../redux/actions/Chain';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../components/IconButton';
import { useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';
import { BALANCE_NOTIFY_QUERY, TRANSFER_NOTIFY_QUERY } from './query';
import _merge from 'lodash/merge';
import { useTranslation } from 'react-i18next';

const TransactionsHistory: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [txnsLoading, setTxnsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchTransactionsHistory());
  }, [dispatch]);

  const { ethAddress } = useSelector(({ chain, wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
    };
  });

  const [historyTokenQuery, { data }] = useLazyQuery(TRANSFER_NOTIFY_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      senderPk: ethAddress,
    },
  });

  const [balanceTokenQuery, balanceData] = useLazyQuery(BALANCE_NOTIFY_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      accountPk: ethAddress,
    },
  });

  useEffect(() => {
    if (ethAddress) {
      balanceTokenQuery();
      historyTokenQuery();
    }
  }, [balanceTokenQuery, ethAddress, historyTokenQuery]);

  useEffect(() => {
    if (data && data.transferNotificationMany) {
      if (balanceData && balanceData.data && balanceData.data.balanceNotificationMany.length > 0) {
        data.transferNotificationMany.map((trns: any) => {
          const token = balanceData.data.balanceNotificationMany.filter(
            (_trns: any) => _trns.token_symbol === trns.token_symbol,
          );

          return _merge(trns, {
            logoURL: token[0].logoURL,
          });
        });
        setTransactionHistory(data.transferNotificationMany);
        setTxnsLoading(false);
      }
    }
  }, [data, balanceData]);

  return (
    <Flex flexDirection="column" style={{ height: '100vh' }}>
      <Text fontSize={3} paddingX={7} paddingTop={9} paddingBottom={4} variant="headingXl">
        {t('transaction.transaction_history')}
      </Text>
      {txnsLoading && transactionHistory.length === 0 ? (
        <TransactionHistoryListPlaceholder />
      ) : !txnsLoading && transactionHistory.length === 0 ? (
        <Text paddingX={7}>{t('transaction.no_transaction')}</Text>
      ) : (
        <TransactionHistoryList transactions={transactionHistory} />
      )}

      <div>
        <Flex
          justifyContent="center"
          style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: '40px' }}
        >
          <IconButton
            onClick={() => {
              history.push('/');
            }}
            marginX={3}
            size="s14"
            icon="close"
            color="white"
            backgroundColor="black"
          />
        </Flex>
      </div>
    </Flex>
  );
};

export default TransactionsHistory;
