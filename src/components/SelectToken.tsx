import React, { useEffect, useState } from 'react';
import { Button, Flex, Text } from 'rebass';
import { SearchHeader } from '../components/SearchHeader';
import TokenList from './Tokens/TokensList/TokenList';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/react-hooks';
import { BALANCE_NOTIFY_QUERY } from '../api/middleware';
import { IToken } from '../interfaces';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import _replace from 'lodash/replace';
import { setToAddress } from 'src/redux/actions/Wallet';
import { isValidChecksumAddress } from 'ethereumjs-util';
import { setModalData } from 'src/redux/actions/Modal';
import IconButton from './IconButton';

export const SelectToken: React.FC = (props: any) => {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [tokenList, setTokenList] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const errorModalMsg = (title: string) => (
    <Flex width="max-content" margin="auto" className="error-modal">
      <IconButton height="26px" width="26px" icon="errorOutline" />
      <Text className="error-message">{t(title)}</Text>
    </Flex>
  );

  const handlebackbtn = () => {
    const params = new URLSearchParams(location.search);
    const callbackParam = params.get('callback');
    if (callbackParam) {
      window.location.href = `${callbackParam}${callbackParam.includes('?') ? '&' : '?'}_id=${t('payment.invalid_address')}`;
    } else {
      history.push('/');
      dispatch(setModalData(false, 'permission'));
    }
  }

  const errorModalBody = (title: string, btntitle: string) => (
    <Flex flexDirection="column" width="max-content" margin="auto">
      <Text margin="10px 0px" width="275px">
        {t(title)}
      </Text>
      <Button
        className="modal-login-btn"
        height="30px"
        margin="20px auto 0px"
        width="170px"
        style={{ padding: '0px', borderRadius: '30px', background: '#3752F5' }}
        onClick={handlebackbtn}
      >
        {t(btntitle)}
      </Button>
    </Flex>
  );

  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const toParam = params.get('to');
      const callbackParam = params.get('callback');
      if (toParam && isValidChecksumAddress(toParam)) {
        dispatch(setToAddress(_replace(toParam, /['"]+/g, '')))
      } else {
        dispatch(
          setModalData(
            true,
            errorModalMsg('payment.invalid_address'),
            errorModalBody('', `${callbackParam ? 'payment.go_back' : 'payment.back_home'}`),
            'permission',
            false
          ),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    if (ethAddress) {
      balanceTokenQuery();
    }
  }, [balanceTokenQuery, ethAddress]);

  useEffect(() => {
    if (data && data.balanceNotificationMany) {
      const list = data.balanceNotificationMany.filter(
        (_token: IToken) => _token.amount && _token.amount > 0,
      );
      const newTokenList = list.filter((tk: IToken) => tk.logoURL && tk.logoURL.includes('description'))
      newTokenList.map((ntk: IToken) => {
        const newtknData = ntk.logoURL && JSON.parse(ntk.logoURL);
        const newtkIndex = list.findIndex((tk: IToken) => ntk.token_symbol === tk.token_symbol);
        newtkIndex && (list[newtkIndex] = {...list[newtkIndex], ...newtknData, logoURL: newtknData.logoURL})

        return ntk;
      })
      setTokenList(list);
      setLoading(false);
    } else if (data && data.balanceNotificationMany.length === 0) {
      setLoading(false);
    }
  }, [data]);

  return (
    <Flex flexDirection="column" backgroundColor="#eff3ff" height="100vh">
      <SearchHeader back={'scan'} to={toAddress} />
      <Flex marginTop={2} className="selectTokenList" >
        {!loading ? (tokenList.length > 0 ? (
          <TokenList tokens={tokenList} />
        ) : (
          <Text fontSize="1.5rem" width="100%" textAlign="center" marginY="50%">{t('payment.empty_wallet')} </Text>
        )) :(
          <Text fontSize="1.25rem" width="100%" textAlign="center" marginY="50%">{t('new_crowdsale.loading')} </Text>
        )}
      </Flex>
    </Flex>
  );
};
