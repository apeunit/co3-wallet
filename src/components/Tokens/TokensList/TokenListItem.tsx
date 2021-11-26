import React from 'react';
import { Flex, Text } from 'rebass';
import Avatar from '../../Avatar';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTransferToken } from '../../../redux/actions/Wallet';
import { getThumbUrl } from 'src/api/firstlife';

const TokenListItem = ({ logoURL, name, symbol, amount, decimals, ...rest }: any) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const selectToken = () => {
    const token = {
      logoURL,
      name,
      symbol,
      amount,
      decimals,
      ...rest,
    };
    dispatch(setTransferToken(token));
    if (history.location.pathname === '/') {
      history.push({ pathname: '/token-detail', state: { token } });
    } else {
      history.push({ pathname: '/payment', search: location.search, state: { token } });
    }
  };

  return (
    <Flex
      onClick={selectToken}
      width="100%"
      color="text"
      alignItems="center"
      paddingTop="14px"
      paddingX={7}
    >
      <Avatar image={getThumbUrl(logoURL)} size="s12" />
      <Flex flexDirection="column" justifyContent="center" alignItems="flex-start" paddingLeft={3}>
        <Text className="token-list-name" fontFamily="sans" fontSize={2} fontWeight="regular" textAlign="left">
          {name}
        </Text>
        <Text fontFamily="sans" fontSize="11px" fontWeight="regular" textAlign="left">
          {symbol}
        </Text>
        {/* <Badge marginY={1}>{symbol}</Badge> */}
      </Flex>
      <Text className="token-list-symbol" fontFamily="sans" fontSize={2} fontWeight="bold" marginLeft="auto" marginBottom={5}>
        {decimals > 0 ? amount / 100 : amount}
      </Text>
    </Flex>
  );
};

export default TokenListItem;
