import React, { useEffect, useState } from 'react';
import { Flex } from 'rebass';
import { SearchHeader } from '../components/SearchHeader';
import TokenList from './Tokens/TokensList/TokenList';
import { useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/react-hooks';
import { BALANCE_NOTIFY_QUERY } from '../containers/query';
import { IToken } from '../interfaces';

export const SelectToken: React.FC = (props: any) => {
  const [tokenList, setTokenList] = useState([]);
  const { toAddress, ethAddress } = useSelector(({ wallet }: any) => {
    return {
      ethAddress: wallet.ethAddress,
      toAddress: wallet.transfer.to,
    };
  });

  const [balanceTokenQuery, { data }] = useLazyQuery(BALANCE_NOTIFY_QUERY, {
    variables: {
      accountPk: ethAddress,
    },
  });

  useEffect(() => {
    if (ethAddress) {
      balanceTokenQuery();
    }
  }, [balanceTokenQuery, ethAddress]);

  useEffect(() => {
    if (data) {
      const list = data.balanceNotificationMany.filter(
        (_token: IToken) => _token.amount && _token.amount > 0,
      );
      setTokenList(list);
    }
  }, [data, tokenList]);

  return (
    <Flex flexDirection="column" backgroundColor="#eff3ff" height="100vh">
      <SearchHeader back={'scan'} to={toAddress} />
      <Flex marginTop={5} className="selectTokenList">
        <TokenList tokens={tokenList} />
      </Flex>
    </Flex>
  );
};
