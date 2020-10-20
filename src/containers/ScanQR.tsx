import React from 'react';
import QrReader from 'react-qr-reader';
import IconButton from '../components/IconButton';
import { Box, Flex, Text } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isAddress } from '../utils/misc';
import { setToAddress } from '../redux/actions/Wallet';
import { setModalData, toggleModal } from '../redux/actions/Modal';
import { useTranslation } from 'react-i18next';

const ScanQR = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const { features } = useSelector(({ pilot }: any) => {
    return {
      features: pilot.features,
    };
  });

  const onScan = (data: any) => {
    const { state }: any = history.location;
    if (data) {
      if (isAddress(data.toLowerCase())) {
        dispatch(setToAddress(data.toLowerCase()));

        features.indexOf('multiToken') > -1
          ? state && state.token
            ? history.replace({ pathname: '/payment', state })
            : history.push('/select-token')
          : history.push('/payment');
      } else {
        console.log('Invalid data', data);
      }
    }
  };

  const onError = (err: any) => {
    dispatch(setModalData(true, 'Error', err.message, 'permission'));
    dispatch(toggleModal());
  };

  return (
    <Flex flexDirection="column" height="100vh" paddingX={7} justifyContent="flex-end">
      <Text variant="headingXl">{t('scan_qr.scan')}</Text>
      <Text variant="headingXl" color="blue500">
        {t('scan_qr.qr_code')}
      </Text>
      <Box
        backgroundColor="background"
        marginTop={5}
        sx={{
          borderRadius: 'r5',
          paddingBottom: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          size="100%"
          sx={{
            position: 'absolute',
          }}
        >
          <Box size="100%">
            <QrReader
              delay={300}
              onScan={(data) => {
                onScan(data);
              }}
              onError={(err) => {
                onError(err);
              }}
            />
          </Box>
        </Flex>
      </Box>
      <Flex justifyContent="center" marginY={10}>
        <IconButton
          onClick={() => {
            history.push('/');
          }}
          marginX={3}
          size="s14"
          icon="close"
          color="white"
          backgroundColor="black"
        />
      </Flex>
    </Flex>
  );
};

export default ScanQR;
