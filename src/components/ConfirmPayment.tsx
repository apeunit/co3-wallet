import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text } from 'rebass';
import TokenCard from './Tokens/CreateTokens/TokenCard';
import { Slider } from '../components/Slider';
import IconButton from './IconButton';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { transferTokens } from '../redux/actions/Chain';
import { setModalData } from '../redux/actions/Modal';
import { SearchHeader } from './SearchHeader';
import InfoBar from './InfoBar';
import AvatarBadge from './AvatarBadge';
import { useTranslation } from 'react-i18next';
import Loading from '../components/Loading';
import { saveWebhookAPI } from 'src/utils/helper';
import { setToAddress, setTransferAmount, setTransferToken } from 'src/redux/actions/Wallet';
import _replace from 'lodash/replace';
import { BALANCE_NOTIFY_QUERY_TOKEN, GET_ALL_TOKENS } from 'src/api/middleware';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import ErrorMsg from './ErrorMsg';

const ConfirmPayment = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [tokenData, setTokenData] = useState<any>({});

  const { amount, token, to, ethAddress } = useSelector(({ wallet }: any) => {
    return {
      amount: wallet.transfer.amount,
      token: wallet.transfer.token,
      to: wallet.transfer.to,
      ethAddress: wallet.ethAddress,
    };
  });
  const tokenQueryData = useQuery(GET_ALL_TOKENS);
  const [tokenAmountQuery, { data }] = useLazyQuery(BALANCE_NOTIFY_QUERY_TOKEN);

  useEffect(() => {
    if (!tokenQueryData.loading && tokenQueryData.data && tokenQueryData.data.tokenAddedMany) {
      setTokenList(tokenQueryData.data.tokenAddedMany);
    }
  }, [tokenQueryData]);

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

  const errorModalBody = (title: string, btntitle: string, _error: string) => (
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
        {t(btntitle)}
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
      if (tokenParam && tokenList.length > 0) {
        const tokenNew: any = tokenList.find(
          (tkn: any) =>
            tkn.token_symbol === _replace(tokenParam, /['"]+/g, '') ||
            tkn.symbol === _replace(tokenParam, /['"]+/g, ''),
        );
        if (tokenNew) {
          tokenAmountQuery({
            variables: {
              accountPk: ethAddress,
              contractAddress: tokenNew?.contractAddress,
            },
          });
          if (tokenNew.logoURL && tokenNew.logoURL.includes('description')) {
            const newtknData = tokenNew.logoURL && JSON.parse(tokenNew.logoURL);
            setTokenData({ ...tokenNew, ...newtknData, logoURL: newtknData.logoURL });
          } else {
            setTokenData(tokenNew);
          }
          if (amountParam && tokenNew?.decimals === 0 && !Number.isInteger(amountParam)) {
            dispatch(
              setModalData(
                true,
                errorModalMsg('payment.amount_coupon_error'),
                errorModalBody('payment.amount_coupon_error_msg', `${callbackParam ? 'payment.go_back' : 'payment.back_home'}`, 'payment.amount_coupon_error'),
                'permission',
                false
              ),
            );

            return;
          }
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
      toParam && dispatch(setToAddress(_replace(toParam, /['"]+/g, '')));
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
      if (amountParam && tokenData?.decimals === 0 && !Number.isInteger(amountParam)) {
        dispatch(
          setModalData(
            true,
            errorModalMsg('payment.amount_coupon_error'),
            errorModalBody('payment.amount_coupon_error_msg', `${callbackParam ? 'payment.go_back' : 'payment.back_home'}`, 'payment.amount_coupon_error'),
            'permission',
            false
          ),
        );

        return;
      }
      amountParam && dispatch(setTransferAmount(amountParam));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, tokenList]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    const amountParam = params.get('amount');
    const callbackParam = params.get('callback');
    if (tokenParam) {
      const amount = data?.balanceNotificationMany[0]?.amount;
      dispatch(
        setTransferToken({
          ...tokenData,
          amount,
        }),
      );
      if (amountParam && (tokenData?.decimals === 2 ? amount / 100 : amount) < Number(amountParam)) {
        dispatch(
          setModalData(
            true,
            errorModalMsg('payment.amount_error'),
            errorModalBody('', `${callbackParam ? 'payment.go_back' : 'payment.back_home'}`, 'payment.amount_error'),
            'permission',
            false
          ),
        );

        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, tokenData]);

  const tokenAmount = () => {
    return token?.amount && token?.decimals === 2 ? token?.amount / 100 : token?.amount || 0
  }

  const handleSendToken = () => {
    setLoader(true);
    const params = new URLSearchParams(location.search);
    const amountParam = params.get('amount');
    if (!token) {
      return;
    }
    if (tokenAmount() < Number(amountParam)) {
      setLoader(false);
      setError(t('payment.amount_error'))
      dispatch(
        setModalData(true, t('payment.payment_failed'), t('payment.amount_error'), 'permission'),
      );

      return;
    }
    let callbackParam: string | null;
    let webHookParam: string | null;
    if (location.search) {
      const params = new URLSearchParams(location.search);
      callbackParam = params.get('callback');
      webHookParam = params.get('webhook');
    }
    if (token && Object.keys(token) && Object.keys(token).length && Number(amount) && to) {
      /**
       * TODO: check if these copy/conversion ops are needed
       */
      const receipt: any = dispatch(transferTokens({ ...token }, to, amount));
      receipt
        .then(async (res: any) => {
          if (callbackParam) {
            window.location.href = `${callbackParam}${callbackParam.includes('?') ? '&' : '?'}_id=${res.transactionHash
              }`;
          }
          if (webHookParam) {
            await saveWebhookAPI(webHookParam, res.transactionHash, res);
          }
          setLoader(false);
          history.push('/');
          dispatch(
            setModalData(
              true,
              t('payment.payment_info'),
              t('common.transaction_complete'),
              'permission',
            ),
          );
        })
        .catch(async (err: any) => {
          if (callbackParam) {
            window.location.href = `${callbackParam}${callbackParam.includes('?') ? '&' : '?'
              }_id=error`;
          }
          if (webHookParam) {
            await saveWebhookAPI(webHookParam, 'error', err);
          }
          setLoader(false);
          console.log(err, 'confirm payment');
          dispatch(
            setModalData(
              true,
              t('payment.payment_failed'),
              err.message.split('\n')[0],
              'permission',
            ),
          );
        });
    } else if (!token || !to) {
      setTimeout(() => {
        setLoader(false);
        dispatch(
          setModalData(
            true,
            t('payment.payment_failed'),
            t(`payment.${!token ? 'token' : 'to'}_error`),
            'permission',
          ),
        );
      }, 2000);
    }
  };
  const { state }: any = history.location;

  return (
    <Flex
      backgroundColor="white"
      flexDirection="column"
      height="100vh"
      width="100%"
      justifyContent="space-between"
      display="contents"
    >
      <Loading loader={loader} />
      <Box style={{ width: '100%' }}>
        <SearchHeader back={(state && state.from) || '/payment'} to={to} />
        <InfoBar>
          <Text variant="base">{t('common.from')}</Text>
          <AvatarBadge image={token && token.logoURL} label={token && token.name} />
        </InfoBar>
      </Box>
      <Flex flexDirection="column" margin={5}>
        <TokenCard
          icon={token?.logoURL || ''}
          name={token?.name || ''}
          symbol={token?.token_symbol || token?.symbol || ''}
          amount={tokenAmount()}
        />
        <Flex marginTop="10px" justifyContent="space-between">
          <Text fontSize="16px">{t('payment.amount')}</Text>
          <Text fontSize="40px">{amount}</Text>
        </Flex>
      </Flex>

      {error ? (
        <Flex flexDirection="row" paddingY={10} marginTop="65px" justifyContent="space-around" width="100%">
          <ErrorMsg
            style={{
              opacity: '0.8',
              position: 'absolute',
              top: '88%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
            title={error}
            type="error"
          />
        </Flex>
      ) : (
        <Flex flexDirection="row" paddingY={10} justifyContent="space-around" width="100%">
          <IconButton
            onClick={() => {
              history.push('/pay');
            }}
            size="s14"
            icon="dialpad"
            color="#8E949E"
            backgroundColor="#ffffff"
            sx={{
              borderRadius: 'full',
              borderColor: '#F1F3F6',
              borderWidth: '2px',
              borderStyle: 'solid',
            }}
          />
          <Slider
            title={t('payment.slide_to_send')}
            bgColor="#F1F3F6"
            btnColor="blue600"
            txtColor="#8E949E"
            dragEnd={handleSendToken}
            onClick={handleSendToken}
          />
        </Flex>
      )}
    </Flex>
  );
};
export default ConfirmPayment;
