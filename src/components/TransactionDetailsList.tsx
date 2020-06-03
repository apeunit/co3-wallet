import React from 'react';
import { Box, Flex, Text } from 'rebass';
import Moment from 'react-moment';
import Avatar from './Avatar';

const TransactionDetailItem = ({ title, value }: any) => (
  <Flex padding="10px 20px" justifyContent="space-between">
    <Text style={{ textTransform: 'capitalize' }}>{title}</Text>
    {title === 'Timestamp: ' ? (
      <Flex style={{ display: 'inline-grid', justifyItems: 'end' }}>
        <Moment utc={true} local={true} format="ddd D MMM YYYY HH:MM">
          {parseInt(value, 10) * 1000}
        </Moment>
        <Flex>
          (
          <Moment utc={true} local={true} fromNow={true}>
            {parseInt(value, 10) * 1000}
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
  return (
    <Box flex="1" overflow="auto" paddingTop={1}>
      <Flex justifyContent="center">
        <Avatar image={transaction.logoURL} size="80px" />
      </Flex>
      <TransactionDetailItem title="Event Name: " value={transaction.event} />
      <TransactionDetailItem title="Block Hash: " value={transaction.blockHash} />
      <TransactionDetailItem title="Transaction Hash: " value={transaction.transactionHash} />
      <TransactionDetailItem title="To: " value={transaction.to || transaction.contractAddress} />
      <TransactionDetailItem title="From" value={transaction.from} />
      <TransactionDetailItem title="Block Number: " value={transaction.blockNumber} />
      <TransactionDetailItem title="Decimal" value={transaction.decimals} />
      <TransactionDetailItem title="Balance" value={transaction.value} />
      <TransactionDetailItem title="Timestamp: " value={transaction.timestamp} />
    </Box>
  );
};

export default TransactionDetails;
