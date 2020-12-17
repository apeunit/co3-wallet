import React, { useEffect } from 'react';
import { Flex, Text } from 'rebass';
import TransactionHistoryList from '../components/Transactions/TransactionList/TransactionHistoryList';
import TransactionHistoryListPlaceholder from '../components/Transactions/TransactionList/TransactionHistoryListPlaceholder';
import { fetchTransactionsHistory } from '../redux/actions/Chain';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../components/IconButton';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SignleTokenTxnHistory: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const { transactionHistory, token, txnsLoading } = useSelector(({ chain, wallet }: any) => {
    return {
      token: wallet.transfer.token,
      transactionHistory: chain.transactionHistory,
      txnsLoading: chain.txnLoading,
    };
  });

  useEffect(() => {
    dispatch(fetchTransactionsHistory(token));
  }, [dispatch, token]);

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

export default SignleTokenTxnHistory;
