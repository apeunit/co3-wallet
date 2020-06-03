import React, { useEffect, useState } from 'react';
import IconButton from '../components/IconButton';
import { Flex, Text, Box } from 'rebass';
import { useHistory } from 'react-router-dom';
import CreateTokenInput from '../components/CreateTokens/CreateTokenInput';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { initWalletLocal } from '../redux/actions/Wallet';

const TokenFactoryAddress: string =
  localStorage.getItem('tokenFactoryAddress') || process.env.REACT_APP_TOKEN_FACTORY || '';

const ImportPrivatekey: React.FC = () => {
  const history = useHistory();
  const [privateKey, setPrivateKey] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [wsUrl, setWsurl] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handlePrivateKey = (e: any) => {
    setPrivateKey(e);
    setError('');
  };

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

  const { privateKey: pkObj } = useSelector(({ wallet }: any) => {
    return {
      privateKey: wallet.privateKey,
    };
  });

  useEffect(() => {
    if (pkObj || localStorage.getItem('privateKey')) {
      setPrivateKey(pkObj || localStorage.getItem('privateKey'));
    }
    if (TokenFactoryAddress) {
      setTokenAddress(TokenFactoryAddress);
    }
    if (localStorage.getItem('wsUrl')) {
      setWsurl(localStorage.getItem('wsUrl') as string);
    }
  }, [pkObj]);

  const handleSubmit = () => {
    if (!privateKey) {
      setError('Private key is required');
    } else if (!tokenAddress) {
      setError('Token Factory Address is required');
    } else if (!wsUrl) {
      setError('Websocket URL is required');
    } else {
      localStorage.setItem('privateKey', privateKey);
      localStorage.setItem('tokenFactoryAddress', tokenAddress);
      localStorage.setItem('wsUrl', wsUrl);
      dispatch(initWalletLocal());
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
        <Text>Import Private Key</Text>
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
            height: '49vh',
            overflow: 'auto',
            margin: 'auto 0',
          }}
        >
          <Flex justifyContent="center" flexDirection="column" paddingTop="33px">
            <CreateTokenInput
              type="text"
              value={privateKey}
              onChangeValue={handlePrivateKey}
              label="Private Key"
              placeholder="Enter private key"
              maxLength="66"
              msg=""
              error={error}
            />
            <CreateTokenInput
              type="text"
              value={tokenAddress}
              onChangeValue={handleTokenAdd}
              label="Token Factory Address"
              placeholder="Enter token factory address"
              maxLength="42"
              msg="focusFalse"
              error=""
            />
            <CreateTokenInput
              type="text"
              value={wsUrl}
              onChangeValue={handleWsUrl}
              label="Websocket URL"
              placeholder="Enter websocket url"
              maxLength=""
              msg="focusFalse"
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

export default ImportPrivatekey;
