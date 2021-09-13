import React, { useEffect, useState } from 'react';
import InfoBar from '../components/InfoBar';
import AvatarBadge from '../components/AvatarBadge';
import Keyboard from '../components/Keyboard';
import { Button, Flex, Text } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { SearchHeader } from '../components/SearchHeader';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setToAddress, setTransferAmount, setTransferToken } from 'src/redux/actions/Wallet';
import _replace from 'lodash/replace';
import IconButton from 'src/components/IconButton';
import { setModalData } from 'src/redux/actions/Modal';

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

  const errorModalMsg = (title: string) => (
    <Flex width="max-content" margin="auto" className="error-modal">
      <IconButton height="26px" width="26px" icon="errorOutline" />
      <Text className="error-message">{t(title)}</Text>
    </Flex>
  );

  const handlebackbtn = (_error: string) => {
    const params = new URLSearchParams(location.search);
    const callbackParam = params.get('callback');
    if (callbackParam) {
      window.location.href = `${callbackParam}${callbackParam.includes('?') ? '&' : '?'}_id=${t(_error)}`;
    } else {
      history.push('/');
      dispatch(setModalData(false, 'permission'));
    }
  }

  const errorModalBody = (title: string, btnTitle: string, _error: string) => (
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
        onClick={() => handlebackbtn(_error)}
      >
        {t(btnTitle)}
      </Button>
    </Flex>
  );

  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const toParam = params.get('to');
      const tokenParam = params.get('token');
      const amountParam = params.get('amount');
      const callbackParam = params.get('callback');
      toParam && dispatch(setToAddress(_replace(toParam, /['"]+/g, '')));
      if (tokenParam && tokenList.length > 0) {
        const tokenNew = tokenList.find(
          (tkn: any) => tkn.token_symbol === _replace(tokenParam, /['"]+/g, ''),
        );
        if (tokenNew) {
          dispatch(setTransferToken(tokenNew))
        } else {
          params.delete('token')
          dispatch(
            setModalData(
              true,
              errorModalMsg('payment.token_error'),
              errorModalBody('', `${callbackParam ? 'payment.go_back' : 'payment.back_home'}`, 'payment.token_error'),
              'permission',
              false
            ),
          );
        }
      }
      if (amountParam && (!Number(amountParam) || Number(amountParam) < 0)) {
        dispatch(
          setModalData(
            true,
            errorModalMsg('payment.amount_error'),
            errorModalBody('payment.amount_negative_error_msg', `${callbackParam ? 'payment.go_back' : 'payment.back_home'}`, 'payment.amount_error'),
            'permission',
            false
          ),
        );

        return;
      }
      amountParam && dispatch(setTransferAmount(amountParam));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location.search, t, tokenList]);

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
    if (amount > 0 && amount <= (token.decimals === 2 ? token?.amount / 100 : parseInt(token?.amount, 10))) {
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
      <SearchHeader to={to} />
      <InfoBar style={{ width: '100%' }}>
        <Text variant="base">{t('common.from')}</Text>
        <AvatarBadge image={token && token.logoURL} label={token && token.name} />
      </InfoBar>

      <Text
        marginTop="auto"
        alignSelf="flex-end"
        paddingX={7}
        paddingY={8}
        variant="headingX2l"
        style={{ maxWidth: '100%', wordBreak: 'break-all', textAlign: 'right' }}
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
