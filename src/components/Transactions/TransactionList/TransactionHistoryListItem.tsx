import React, { useState } from 'react';
import { Box, Flex, Text } from 'rebass';
import Icon from '../../Icon';
import AvatarBadge from '../../AvatarBadge';
import Moment from 'react-moment';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface IProps {
  transaction: any;
}

const TransactionHistoryListItem: React.FC<IProps> = ({ transaction }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [hover, setHover] = useState(false);
  const { ethAddress } = useSelector(({ wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
    };
  });

  const icon = transaction.executed_on
    ? transaction.sender_pk === ethAddress
      ? 'remove'
      : 'add'
    : 'flip';

  const ToggleHover = (val: boolean) => {
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
          <Box marginRight="8px" style={{ minWidth: '150px' }} flex="1">
            <Flex fontSize={2} color="#191919">
              {transaction.sender_pk === ethAddress ? (
                <Flex justifyContent="space-between">
                  <Text minWidth="max-content" marginRight="5px">
                    {t('common.to')}
                  </Text>
                  <Text
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      display: 'block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {transaction.receiver_pk}
                  </Text>
                </Flex>
              ) : (
                <>
                  <Text minWidth="max-content" marginRight="5px">
                    {t('common.from')}
                  </Text>
                  <Text
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      display: 'block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {transaction.sender_pk === '0x0000000000000000000000000000000000000000'
                      ? transaction.owner
                      : transaction.sender_pk}
                  </Text>
                </>
              )}
            </Flex>
            <Text fontSize={2} color="#757575">
              {transaction.executed_on ? (
                <Moment fromNow={true}>{transaction.executed_on}</Moment>
              ) : (
                `${t('common.pending')}...`
              )}
            </Text>
          </Box>
          <Box
            color={`${transaction.sender_pk === ethAddress ? '#F00034' : '#00BD8E'}`}
            flex="1"
            style={{
              textAlign: 'right',
            }}
          >
            <Text
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                display: 'block',
                whiteSpace: 'nowrap',
              }}
              fontSize={2}
            >
              {transaction.decimals === 2 ? transaction.amount / 100 : transaction.amount}
            </Text>
            <Text fontSize={1} marginLeft="auto" marginRight="0" style={{ width: 'max-content' }}>
              {transaction.token_symbol}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default TransactionHistoryListItem;
