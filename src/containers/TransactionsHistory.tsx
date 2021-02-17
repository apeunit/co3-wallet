import React, { useEffect, useState } from 'react';
import { Flex, Image, Text } from 'rebass';
import TransactionHistoryList from '../components/Transactions/TransactionList/TransactionHistoryList';
import TransactionHistoryListPlaceholder from '../components/Transactions/TransactionList/TransactionHistoryListPlaceholder';
import { useSelector } from 'react-redux';
import IconButton from '../components/IconButton';
import { useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';
import { BALANCE_NOTIFY_QUERY, CrowdsaleSortEnum, TRANSFER_NOTIFY_QUERY } from '../api/middleware';
import _merge from 'lodash/merge';
import { useTranslation } from 'react-i18next';
import EmptyImg from '../images/empty.png';

const TransactionsHistory: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [txnsLoading, setTxnsLoading] = useState(true);

  const { ethAddress } = useSelector(({ wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
    };
  });

  const [historyTokenQuery, { data }] = useLazyQuery(TRANSFER_NOTIFY_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      senderPk: ethAddress,
      sort: CrowdsaleSortEnum.DESC,
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
    if (data && data.transferNotificationMany.length > 0) {
      if (balanceData && balanceData.data && balanceData.data.balanceNotificationMany.length > 0) {
        data.transferNotificationMany.map((trns: any) => {
          const token = balanceData.data.balanceNotificationMany.filter(
            (_trns: any) => _trns.token_symbol === trns.token_symbol,
          );

          let newtknData = token[0].logoURL && token[0].logoURL.includes('description') && JSON.parse(token[0].logoURL);

          return token[0].logoURL && token[0].logoURL.includes('description') ?  
            _merge(trns, {
              logoURL: newtknData?.logoURL,
            })
            : 
            _merge(trns, {
              logoURL: token[0].logoURL,
            })
        });
        setTransactionHistory(data.transferNotificationMany);
        setTxnsLoading(false);
      }
    } else if (data?.transferNotificationMany) {
      setTxnsLoading(false);
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
        <Flex paddingBottom="125px" width="212px" margin="auto"  flexDirection="column">
          <Image marginBottom="35px" src={EmptyImg} />
          <Text width="195px" textAlign="center">{t('transaction.no_transaction')}</Text>
        </Flex>

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
