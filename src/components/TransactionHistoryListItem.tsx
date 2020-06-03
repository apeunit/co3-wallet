import React, { useState } from 'react';
import { Box, Flex, Text } from 'rebass';
import Icon from './Icon';
import AvatarBadge from './AvatarBadge';
import Moment from 'react-moment';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface IProps {
  transaction: any;
}

const TransactionHistoryListItem: React.FC<IProps> = ({ transaction }) => {
  const history = useHistory();
  const [hover, setHover] = useState(false);
  const { ethAddress } = useSelector(({ wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
    };
  });
  const icon = transaction.timestamp
    ? transaction.event === 'Transfer'
      ? transaction.from && transaction.from === ethAddress
        ? 'remove'
        : 'add'
      : 'add'
    : 'flip';

  const ToggleHover = (val:boolean) => {
    setHover(val);
  };

  return (
    <>
      <Flex
        onClick={() => history.push({ pathname: '/transaction-details', state: transaction })}
        style={{
          padding: '17px 20px 14px 20px',
          cursor: 'pointer',
          backgroundColor: `${hover ? '#ececec' : '#fff'}`,
        }}
        marginTop="auto"
        alignSelf="flex-end"
        alignItems="center"
        fontSize={3}
        variant="headingXl"
        onMouseEnter={() => ToggleHover(true)}
        onMouseLeave={() => ToggleHover(false)}
      >
        <Flex style={{ flexShrink: 0 }}>
          <Flex
            style={{ width: '32px', height: '32px', borderRadius: '100px', zIndex: 5 }}
            backgroundColor="#F4F8FE"
          >
            <Text
              style={{
                margin: '0 auto',
              }}
              color="red"
            >
              <Icon
                name={icon}
                style={{
                  width: '16px',
                  height: '16px',
                  fill: `${icon === 'add' ? '#00BD8E' : '#F00034'}`,
                }}
              />
            </Text>
          </Flex>
          <Flex
            style={{ marginLeft: '-7px', zIndex: 9, minWidth: '32px' }}
            width="32px"
            height="32px"
          >
            <AvatarBadge image={transaction.logoURL} />
          </Flex>
        </Flex>
        <Flex style={{ width: '100%' }} paddingLeft="8px" justifyContent="space-between">
          <Box marginRight="8px" flex="1">
            <Flex fontSize={2} color="#191919">
              {transaction.to &&
              (transaction.from === ethAddress ||
                transaction.from === '0x0000000000000000000000000000000000000000') ? (
                <Flex justifyContent="space-between">
                  <Text minWidth="max-content" marginRight="5px">
                    To
                  </Text>
                  <Text
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      display: 'block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {transaction.to}
                  </Text>
                </Flex>
              ) : (
                <>
                  {transaction.event === 'Transfer' && (
                    <Text minWidth="max-content" marginRight="5px">
                      From
                    </Text>
                  )}
                  <Text
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      display: 'block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {transaction.event === 'Transfer' ? transaction.from : transaction.name}
                  </Text>
                </>
              )}
            </Flex>
            <Text fontSize={2} color="#757575">
              {transaction.timestamp ? (
                <Moment fromNow={true}>{parseInt(transaction.timestamp, 10) * 1000}</Moment>
              ) : (
                'Pending...'
              )}
            </Text>
          </Box>
          <Box
            color={`${
              transaction.event === 'Transfer' && transaction.from === ethAddress
                ? '#F00034'
                : '#00BD8E'
            }`}
            flex="1"
            style={{
              textAlign: 'right',
            }}
          >
            {transaction.event === 'Transfer' ? (
              <Text
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  display: 'block',
                  whiteSpace: 'nowrap',
                }}
                fontSize={2}
              >
                {transaction.value / Math.pow(10, transaction.decimals)}
              </Text>
            ) : (
              <Text
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  display: 'block',
                  whiteSpace: 'nowrap',
                }}
                fontSize={2}
              >
                {transaction.value}
              </Text>
            )}
            <Text fontSize={1} marginLeft="auto" marginRight="0" style={{ width: 'max-content' }}>
              {transaction.symbol}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default TransactionHistoryListItem;
