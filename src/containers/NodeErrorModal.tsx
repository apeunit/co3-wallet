import React, { useState, useEffect } from 'react';
import { Button, Flex, Text } from 'rebass';
import Modal from '../components/Modal';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from '../redux/actions/Modal';
import { Input } from '@rebass/forms';
import IconButton from '../components/IconButton';
import { initialSetup } from '../redux/actions/Chain';
import { initWalletLocal } from '../redux/actions/Wallet';

const NodeErrorModal: React.FC = () => {
  const dispatch = useDispatch();
  const [url, setURL] = useState('');

  const { wallet: walletObj, modal: modalObj } = useSelector(({ wallet, modal }: any) => {
    return {
      wallet,
      modal,
    };
  });

  useEffect(() => {
    if (localStorage.getItem('wsUrl')) {
      setURL(localStorage.getItem('wsUrl') || '');
    }
  }, []);

  const handleRetry = () => {
    localStorage.setItem('wsUrl', url);
    if (!localStorage.getItem('privateKey')) {
      dispatch(initialSetup(walletObj && walletObj.privateKey));
    } else {
      dispatch(initWalletLocal());
    }
  };

  return (
    <>
      <AnimatePresence>
        {modalObj && modalObj.isOpen && (
          <Modal close={() => dispatch(toggleModal())}>
            <Flex justifyContent="center">
              <IconButton
                marginY={2}
                size="s8"
                backgroundColor={'red'}
                color={'white'}
                icon={'close'}
                cursor={'default'}
              />
            </Flex>
            <Text variant="heading" textAlign="center">
              Failure
            </Text>
            <Text variant="base" textAlign="center" marginTop={4}>
              Failure to connect to Ethereum node
            </Text>

            <Input
              marginY={6}
              paddingY={4}
              sx={{
                border: '1px solid #ccc',
                borderRadius: '10px',
              }}
              value={url}
              onChange={(e) => setURL(e.target.value)}
              id="token"
              name="token"
              type="text"
              placeholder="Node Url"
            />
            <Button
              paddingY={4}
              sx={{
                borderRadius: '10px',
              }}
              onClick={handleRetry}
            >
              Retry
            </Button>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default NodeErrorModal;
