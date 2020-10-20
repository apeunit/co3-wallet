import React, { useEffect, useState } from 'react';
import IconButton from '../components/IconButton';
import { Box, Flex, Text } from 'rebass';
import { useHistory } from 'react-router-dom';
import CreateInputStep from '../components/StepsComponents/CreateInputStep';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setNodeUrl, setTokenFactoryAddress } from '../redux/actions/Wallet';
import { useTranslation } from 'react-i18next';
import { NODE_URL, TOKEN_FACTORY_ADDRESS } from '../config';

const AppSettings: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [tokenAddress, setTokenAddress] = useState('');
  const [wsUrl, setWsurl] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleTokenAdd = (e: any) => {
    setTokenAddress(e);
    setError('');
  };

  const handleWsUrl = (e: any) => {
    setWsurl(e);
    setError('');
  };

  const handleClose = () => {
    history.push('/');
  };

  const { nodeUrl, tokenFactoryAddress } = useSelector(({ wallet }: any) => {
    return {
      nodeUrl: wallet.nodeUrl,
      tokenFactoryAddress: wallet.tokenFactoryAddress,
    };
  });

  useEffect(() => {
    if (tokenFactoryAddress || TOKEN_FACTORY_ADDRESS) {
      setTokenAddress(tokenFactoryAddress ? tokenFactoryAddress : TOKEN_FACTORY_ADDRESS);
    }
    if (nodeUrl || NODE_URL) {
      setWsurl(nodeUrl ? nodeUrl : NODE_URL);
    }
  }, [nodeUrl, tokenFactoryAddress]);

  const handleSubmit = () => {
    if (!tokenAddress) {
      setError(t('app_settings.token_factory_address_error'));
    } else if (!wsUrl) {
      setError(t('app_settings.websocket_url_error'));
    } else {
      dispatch(setNodeUrl(wsUrl));
      dispatch(setTokenFactoryAddress(tokenAddress));
      setTimeout(() => {
        history.push('/');
      }, 1000);
    }
  };

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      width="100%"
      height="100%"
      style={{ overflow: 'hidden' }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        paddingY={4}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 100 }}
      >
        <IconButton onClick={handleClose} sx={{ cursor: 'pointer' }} icon="back" />
        <Text>{t('app_settings.label')}</Text>
        <IconButton onClick={handleClose} sx={{ cursor: 'pointer' }} icon="close" />
      </Flex>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={{
          flex: 1,
          position: 'absolute',
          top: '0',
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
      >
        <Box
          paddingX={6}
          height="100%"
          width="100%"
          // paddingTop={'67px'}
          style={{
            height: '55vh',
            overflow: 'auto',
            margin: 'auto 0px 90px',
          }}
        >
          <Flex justifyContent="center" flexDirection="column" paddingTop="33px">
            <CreateInputStep
              type="text"
              value={tokenAddress}
              onChangeValue={handleTokenAdd}
              label={t('app_settings.token_factory_address')}
              placeholder={t('app_settings.token_factory_address_placeholder')}
              maxLength="42"
              msg=""
              error={error}
            />
            <CreateInputStep
              type="text"
              value={wsUrl}
              onChangeValue={handleWsUrl}
              label={t('app_settings.websocket_url')}
              placeholder={t('app_settings.websocket_url_placeholder')}
              maxLength=""
              msg=""
              autoFocus={false}
              error=""
            />
          </Flex>
        </Box>
        <Flex
          justifyContent="center"
          backgroundColor="blue600"
          style={{
            height: '56px',
            width: '56px',
            borderRadius: '50px',
            overflow: 'hidden',
            margin: '0 auto',
            position: 'fixed',
            bottom: 'calc( 5vh - 10px )',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <IconButton
            icon="next"
            size="s14"
            color="white"
            onClick={handleSubmit}
            marginBottom="-20px"
          />
        </Flex>
      </motion.div>
    </Flex>
  );
};

export default AppSettings;
