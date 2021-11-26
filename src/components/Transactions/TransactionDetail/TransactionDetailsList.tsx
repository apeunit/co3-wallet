/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Flex, Text } from 'rebass';
import Moment from 'react-moment';
import Avatar from '../../Avatar';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getUserDetailsByAddress } from 'src/api/co3uum';
import { COUPON_PURPOSE } from 'src/config';
import { useLazyQuery } from 'react-apollo';
import { GET_PICKUP_BASKET_ADDED, GET_CROWDSALE_ADDED } from '../../../api/middleware';

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

  const [user, setUser] = useState<any>(null);

  const [loaded, setLoaded] = useState<boolean>(false);

  const [type, setType] = useState<String>('transfer');

  const [artifact, setArtifact] = useState<any>(null);

  const { address, accessToken } = useSelector(({ wallet, co3uum }: any) => {
    return {
      address: wallet.ethAddress,
      accessToken: co3uum.accessToken,
    };
  });

  const getAddress = useCallback((): string => {
    return transaction.receiver_pk === address ? transaction.sender_pk : transaction.receiver_pk;
  }, [address, transaction]);

  const isCoupon = useCallback((): boolean => {
    return transaction.purpose === COUPON_PURPOSE;
  }, [transaction]);

  const getUserDetails = useCallback(async () => {
    const data = await getUserDetailsByAddress(accessToken, getAddress());
    setUser(data?.result[0] || null);
  }, [accessToken, getAddress]);

  const [crowdsaleAddedQuery, crowdsaleAdded] = useLazyQuery(GET_CROWDSALE_ADDED, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: {
        contractAddress: getAddress(),
      },
      limit: 1,
    },
  });

  const [couponBoxAddedQuery, couponBoxAdded] = useLazyQuery(GET_PICKUP_BASKET_ADDED, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: {
        contractAddress: getAddress(),
      },
      limit: 1,
    },
  });

  const isSender = useCallback((): boolean => {
    return transaction.sender_pk === address;
  }, [address, transaction]);

  useEffect(() => {
    if (isCoupon()) {
      crowdsaleAddedQuery();
      couponBoxAddedQuery();
      return;
    }
    setLoaded(true);
    getUserDetails();
  }, [getUserDetails]);

  useEffect(() => {
    const { data } = crowdsaleAdded;
    if (data && data.crowdsaleAddedNotificationMany.length) {
      setArtifact(data.crowdsaleAddedNotificationMany[0]);
      setType('crowdsale');
      setLoaded(true);
    }
  }, [crowdsaleAdded]);

  useEffect(() => {
    const { data } = couponBoxAdded;
    if (data && data.pickUpBasketAddedNotificationMany.length) {
      setArtifact(data.pickUpBasketAddedNotificationMany[0]);
      setType('couponBox');
      setLoaded(true);
    }
  }, [couponBoxAdded]);

  const eventName = () => {
    if(type === 'couponBox'){
      return isSender() ? 'transaction.coupon_box_creation' : 'transaction.coupon_box_participation';
    }

    if(type === 'crowdsale'){
      return isSender() ? 'transaction.crowdsale_creation' : 'transaction.crowdsale_participation';
    }

    if (transaction.sender_pk === '0x0000000000000000000000000000000000000000') {
      return 'transaction.token_mint';
    }
    return 'transaction.transfer_token';
  };

  const identifier = ()=> {
    if(isCoupon()){
      return artifact ? artifact?.metadata?.name : getAddress()
    }
    return user ? user?.identification : getAddress();
  }

  return (
    <Box flex="1" overflow="auto" paddingTop={1}>
      <Flex justifyContent="center">
        <Avatar image={transaction.logoURL} size="80px" />
      </Flex>
      {loaded && (
        <TransactionDetailItem title={`${t('transaction.event_name')}: `} value={t(eventName())} />
      )}
      <TransactionDetailItem
        title={`${transaction.receiver_pk === address ? t('common.from') : t('common.to')}: `}
        value={identifier()}
      />
      <TransactionDetailItem title={`${t('transaction.decimal')}: `} value={transaction.decimals} />
      <TransactionDetailItem
        title={`${t('transaction.balance')}: `}
        value={transaction.decimals === 2 ? transaction.amount / 100 : transaction.amount}
      />
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
