import React from 'react';
import { Text } from 'rebass';
import Modal from '../components/Modal';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from '../redux/actions/Modal';

const ModalContainer = () => {
  const dispatch = useDispatch();
  const { isOpen, title, body, isClose } = useSelector(({ modal }: any) => {
    const { isOpen, title, body, isClose } = modal;

    return {
      isOpen,
      title,
      body,
      isClose
    };
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isClose={isClose}
          close={() => {
            dispatch(toggleModal());
          }}
        >
          <Text variant="heading" textAlign="center">
            {title}
          </Text>
          <Text variant="base" textAlign="center" marginTop={4}>
            {body}
          </Text>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ModalContainer;
