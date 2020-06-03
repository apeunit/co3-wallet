import React from 'react';
import { Flex, Text } from 'rebass';
import TransactionDetailsList from '../components/TransactionDetailsList';
import IconButton from '../components/IconButton';
import { useHistory } from 'react-router-dom';

const TransactionsHistory: React.FC = () => {
  const history = useHistory();
  const state = history.location.state;

  return (
    <Flex flexDirection="column" style={{ height: '100vh' }}>
      <Flex paddingY={7} alignItems="center">
        <IconButton
          onClick={() => {
            history.push('./transaction-history');
          }}
          marginLeft={2}
          sx={{ cursor: 'pointer' }}
          icon="back"
        />
        <Text fontSize={3} paddingLeft={1} variant="headingXl">
          Transactions Details
        </Text>
      </Flex>

      <TransactionDetailsList transaction={state} />
    </Flex>
  );
};

export default TransactionsHistory;
