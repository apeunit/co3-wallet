import React, { useEffect } from 'react';
import { Flex, Text } from 'rebass';
import TransactionHistoryList from '../components/TransactionHistoryList';
import TransactionHistoryListPlaceholder from '../components/TransactionHistoryListPlaceholder';
import { fetchTransactionsHistory } from '../redux/actions/Chain';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../components/IconButton';
import { useHistory } from 'react-router-dom';

const TransactionsHistory: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchTransactionsHistory());
  }, [dispatch]);

  const { transactionHistory, txnsLoading } = useSelector(({ chain }: any) => {
    return {
      transactionHistory: chain.transactionHistory,
      txnsLoading: chain.txnLoading,
    };
  });

  return (
    <Flex flexDirection="column" style={{ height: '100vh' }}>
      <Text fontSize={3} paddingX={7} paddingTop={9} paddingBottom={4} variant="headingXl">
        Transactions History
      </Text>
      {txnsLoading && transactionHistory.length === 0 ? (
        <TransactionHistoryListPlaceholder />
      ) : !txnsLoading && transactionHistory.length === 0 ? (
        <Text paddingX={7}>No Transaction Found</Text>
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
