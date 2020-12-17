import React from 'react';
import { Box, Flex, Text } from 'rebass';
import Moment from 'react-moment';
import Avatar from '../../Avatar';
import { useTranslation } from 'react-i18next';

const TransactionDetailItem = ({ title, value }: any) => (
  <Flex padding="10px 20px" justifyContent="space-between">
    <Text style={{ textTransform: 'capitalize' }}>{title}</Text>
    {title === 'Timestamp: ' ? (
      <Flex style={{ display: 'inline-grid', justifyItems: 'end' }}>
        <Moment utc={true} local={true} format="ddd D MMM YYYY HH:MM">
          {value}
        </Moment>
        <Flex>
          (
          <Moment utc={true} local={true} fromNow={true}>
            {value}
          </Moment>
          )
        </Flex>
      </Flex>
    ) : (
      <Text style={{ maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value || ''}
      </Text>
    )}
  </Flex>
);

const TransactionDetails = ({ transaction }: any) => {
  const { t } = useTranslation();

  return (
    <Box flex="1" overflow="auto" paddingTop={1}>
      <Flex justifyContent="center">
        <Avatar image={transaction.logoURL} size="80px" />
      </Flex>
      {transaction.sender_pk === '0x0000000000000000000000000000000000000000' ? (
        <TransactionDetailItem
          title={`${t('transaction.event_name')}: `}
          value={t('transaction.token_mint')}
        />
      ) : (
        <TransactionDetailItem
          title={`${t('transaction.event_name')}: `}
          value={t('transaction.transfer_token')}
        />
      )}
      <TransactionDetailItem title={`${t('common.to')}: `} value={transaction.receiver_pk} />
      <TransactionDetailItem title={`${t('common.from')}: `} value={transaction.sender_pk} />
      <TransactionDetailItem title={`${t('transaction.decimal')}: `} value={transaction.decimals} />
      <TransactionDetailItem title={`${t('transaction.balance')}: `} value={transaction.decimals === 2 ? transaction.amount / 100 : transaction.amount} />
      <TransactionDetailItem
        title={`${t('transaction.token_symbol')}: `}
        value={transaction.token_symbol}
      />
      <TransactionDetailItem
        title={`${t('transaction.timestamp')}: `}
        value={transaction.executed_on}
      />
    </Box>
  );
};

export default TransactionDetails;
