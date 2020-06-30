import React from 'react';
import { Flex, Text } from 'rebass';
import TransactionDetailsList from '../components/Transactions/TransactionDetail/TransactionDetailsList';
import IconButton from '../components/IconButton';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TransactionsDetails: React.FC = () => {
  const { t } = useTranslation();
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
          {t('transaction.transaction_details')}
        </Text>
      </Flex>

      <TransactionDetailsList transaction={state} />
    </Flex>
  );
};

export default TransactionsDetails;
