import React, { useState } from 'react';
import { Box, Flex, Text } from 'rebass';
import TokenCard from './Tokens/NewToken/TokenCard';
import { Slider } from '../components/Slider';
import IconButton from './IconButton';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { transferToken, transferTokens } from '../redux/actions/Chain';
import { setModalData } from '../redux/actions/Modal';
import { SearchHeader } from './SearchHeader';
import InfoBar from './InfoBar';
import AvatarBadge from './AvatarBadge';
import { useTranslation } from 'react-i18next';
import Loading from '../components/Loading';

const ConfirmPayment = (props: any) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  const { amount, token, to } = useSelector(({ wallet }: any) => {
    return {
      amount: wallet.transfer.amount,
      token: wallet.transfer.token,
      to: wallet.transfer.to,
    };
  });

  const handleSendToken = () => {
    setLoader(true);
    if (Object.keys(token).length && Number(amount) && to) {
      transferToken({});
      /**
       * TODO: check if these copy/conversion ops are needed
       */
      const receipt: any = dispatch(transferTokens({ ...token }, to, amount));
      receipt
        .then((res: any) => {
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
        .catch((err: any) => {
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
          <AvatarBadge image={token.logoURL} label={token.name} />
        </InfoBar>
      </Box>
      <Flex flexDirection="column" margin={5}>
        <TokenCard
          icon={token.logoURL || ''}
          name={token.name || ''}
          symbol={token.token_symbol || ''}
          amount={token.amount || '0'}
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
          onClick={() => console.log}
        />
      </Flex>
    </Flex>
  );
};
export default ConfirmPayment;
