import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from 'rebass';
import TokenCard from './Tokens/CreateTokens/TokenCard';
import { Slider } from '../components/Slider';
import IconButton from './IconButton';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { transferToken, transferTokens } from '../redux/actions/Chain';
import { setModalData } from '../redux/actions/Modal';
import { SearchHeader } from './SearchHeader';
import InfoBar from './InfoBar';
import AvatarBadge from './AvatarBadge';
import { useTranslation } from 'react-i18next';
import Loading from '../components/Loading';
import { saveCallbackAPI } from 'src/api/co3uum';
import { setToAddress, setTransferAmount, setTransferToken } from 'src/redux/actions/Wallet';
import _replace from 'lodash/replace';
import { BALANCE_NOTIFY_QUERY_TOKEN, GET_ALL_TOKENS } from 'src/containers/query';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';

const ConfirmPayment = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const toParam = params.get('to');
      const tokenParam = params.get('token');
      const amountParam = params.get('amount');
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
          setTokenData(tokenNew);
        }
      }
      toParam && dispatch(setToAddress(_replace(toParam, /['"]+/g, '')));
      amountParam && dispatch(setTransferAmount(amountParam));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, token, tokenList]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      const amount = data?.balanceNotificationMany[0]?.amount;
      dispatch(
        setTransferToken({
          ...tokenData,
          amount,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, tokenData]);

  const handleSendToken = () => {
    setLoader(true);
    const params = new URLSearchParams(location.search);
    const amountParam = params.get('amount');
    if (amountParam && token?.amount < amountParam) {
      setLoader(false);
      dispatch(
        setModalData(true, t('payment.payment_failed'), t('payment.amount_error'), 'permission'),
      );

      return;
    }
    let callbackParam: string | null;
    if (location.search) {
      const params = new URLSearchParams(location.search);
      callbackParam = params.get('callback');
    }
    if (token && Object.keys(token) && Object.keys(token).length && Number(amount) && to) {
      transferToken({});
      /**
       * TODO: check if these copy/conversion ops are needed
       */
      const receipt: any = dispatch(transferTokens({ ...token }, to, amount));
      receipt
        .then(async (res: any) => {
          if (callbackParam) {
            await saveCallbackAPI(callbackParam, res.transactionId);
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
            await saveCallbackAPI(callbackParam, 'error');
          }
          setLoader(false);
          console.log(err, 'NewToken');
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

  return (
    <Flex
      backgroundColor="white"
      flexDirection="column"
      height="100vh"
      width="100vw"
      justifyContent="space-between"
      flexWrap="wrap"
    >
      <Loading loader={loader} />
      <Box style={{ width: '100vw' }}>
        <SearchHeader back={'/payment'} to={to} />
        <InfoBar>
          <Text variant="base">{t('common.from')}</Text>
          <AvatarBadge image={token && token.logoURL} label={token && token.name} />
        </InfoBar>
      </Box>
      <Flex flexDirection="column" margin={5}>
        <TokenCard
          icon={(token && token.logoURL) || ''}
          name={(token && token.name) || ''}
          symbol={(token && (token.token_symbol || token.symbol)) || ''}
          amount={(token && token.amount) || '0'}
        />
        <Flex marginTop="10px" justifyContent="space-between">
          <Text fontSize="16px">{t('payment.amount')}</Text>
          <Text fontSize="40px">{amount}</Text>
        </Flex>
      </Flex>
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
    </Flex>
  );
};
export default ConfirmPayment;
