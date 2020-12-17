import React, { useEffect, useState } from 'react';
import InfoBar from '../components/InfoBar';
import AvatarBadge from '../components/AvatarBadge';
import Keyboard from '../components/Keyboard';
import { Flex, Text } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { SearchHeader } from '../components/SearchHeader';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setToAddress, setTransferAmount, setTransferToken } from 'src/redux/actions/Wallet';
import _replace from 'lodash/replace';

const amountRegex = new RegExp('^[0-9]+(.[0-9]{1,2})?$');

const Payment: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [keyDisable, setKeyDisable] = useState(false);

  const { to, amount, token, tokenList } = useSelector(({ wallet, chain }: any) => {
    return {
      to: wallet.transfer.to,
      amount: wallet.transfer.amount,
      token: wallet.transfer.token,
      tokenList: chain.tokenList,
    };
  });

  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const toParam = params.get('to');
      const tokenParam = params.get('token');
      const amountParam = params.get('amount');
      amountParam && dispatch(setTransferAmount(amountParam));
      toParam && dispatch(setToAddress(_replace(toParam, /['"]+/g, '')));
      if (tokenParam && tokenList.length > 0) {
        const tokenNew = tokenList.find(
          (tkn: any) => tkn.token_symbol === _replace(tokenParam, /['"]+/g, ''),
        );
        if (tokenNew) {
          dispatch(setTransferToken(tokenNew))
        } else {
          params.delete('token')
          setError(`${t('payment.token_error')}`);
        }
      }
    }
  }, [dispatch, history, location.search, t, tokenList]);

  const handleTap = (tap: string) => {
    const amountString: string = `${amount}${tap}`;
    if (token?.decimals === 0 && tap.includes('.')) {
      dispatch(setTransferAmount(amount));

      return;
    }
    if (amountString === '0') {
      dispatch(setTransferAmount(`0`));
    }
    if (amountString === '.') {
      dispatch(setTransferAmount(`0${amountString}`));
    }
    if (amountString === '0.') {
      dispatch(setTransferAmount(amountString));
    }
    if (amountRegex.test(`${amountString}0`) && amountString.endsWith('.')) {
      dispatch(setTransferAmount(amountString));
    }
    if (amountRegex.test(amountString)) {
      dispatch(setTransferAmount(amountString));
    }
    setError('');
  };

  const handleErase = () => {
    let amountString: string = amount || '';
    if (amountString) {
      amountString = amountString.slice(0, -1);
      dispatch(setTransferAmount(amountString));
    }
    setError('');
  };

  const handleConfirm = () => {
    if (parseInt(amount, 10) <= (token.decimals === 2 ? parseInt(token?.amount, 10) / 100 : parseInt(token?.amount, 10))) {
      history.push({ pathname: '/confirmpayment', search: location.search, state: { token } });
      setError('');
    } else {
      setError(t('payment.amount_error'));
    }
  };

  useEffect(() => {
    dispatch(setTransferAmount(''));
  }, [dispatch]);

  useEffect(() => {
    if (amount.length >= 7) {
      setKeyDisable(true);
    } else {
      setKeyDisable(false);
    }
  }, [amount, keyDisable]);

  return (
    <Flex flexDirection="column" height="100vh">
      <SearchHeader back={'/scan'} to={to} />
      <InfoBar style={{ width: '100vw' }}>
        <Text variant="base">{t('common.from')}</Text>
        <AvatarBadge image={token && token.logoURL} label={token && token.name} />
      </InfoBar>

      <Text
        marginTop="auto"
        alignSelf="flex-end"
        paddingX={7}
        paddingY={8}
        variant="headingX2l"
        style={{ maxWidth: '100vw', wordBreak: 'break-all', textAlign: 'right' }}
      >
        {amount ? amount : '0'}
      </Text>

      <Keyboard
        marginBottom={10}
        handleTap={handleTap}
        handleErase={handleErase}
        handleConfirm={handleConfirm}
        disable={keyDisable}
        error={error}
        disbaleConfirm={error === ''}
      />
    </Flex>
  );
};

export default Payment;
