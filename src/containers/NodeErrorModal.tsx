import React from 'react';
import { Button, Flex, Text } from 'rebass';
import Modal from '../components/Modal';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from '../redux/actions/Modal';
import { initialSetup } from '../redux/actions/Chain';
import { useTranslation } from 'react-i18next';

const NodeErrorModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();


  const { wallet: walletObj, modal: modalObj } = useSelector(({ wallet, modal }: any) => {
    return {
      wallet,
      modal,
    };
  });

  const handleRetry = () => {
    dispatch(initialSetup(walletObj && walletObj.privateKey));
  };

  return (
    <>
      <AnimatePresence>
        {modalObj && modalObj.isOpen && (
          <Modal close={() => dispatch(toggleModal())}>
            <Flex justifyContent="center">
            </Flex>
            <Text variant="heading" textAlign="center">
              {t('node_error.failure')}
            </Text>
            <Text variant="base" textAlign="center" marginTop={4}>
              {t('node_error.failure_connect')}
            </Text>
            <Button
              paddingY={4}
              sx={{
                borderRadius: '10px',
              }}
              onClick={handleRetry}
            >
              {t('node_error.retry')}
            </Button>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default NodeErrorModal;
