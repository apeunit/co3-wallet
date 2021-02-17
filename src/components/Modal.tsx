import React from 'react';
import { motion } from 'framer-motion';
import { Flex } from 'rebass';
import IconButton from '../components/IconButton';

const shade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.15 } },
};

const Modal = (props: any) => {
  const { children, close, isClose } = props;

  return (
    <motion.div initial="hidden" animate="visible" exit="hidden">
      <motion.div variants={shade} transition={{ duration: 0.2 }} />
      <Flex
        justifyContent="center"
        alignItems="stretch"
        flexDirection="column"
        size="100%"
        backgroundColor="overlay20"
        sx={{
          maxWidth: '768px',
          width: '768px',
          position: 'fixed',
          top: 0,
          zIndex: 100,
        }}
      >
        <motion.div className="modal" variants={modal}>
          <Flex
            flexDirection="column"
            backgroundColor="white"
            m={6}
            paddingY={10}
            paddingX={7}
            sx={{
              borderTopLeftRadius: 'r10',
              borderTopRightRadius: 'r10',
              borderRadius: 'r6',
              boxShadow: 'base',
              position: 'relative',
            }}
          >
            {isClose && (
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '0',
                  right: '5px',
                  borderRadius: 'full',
                }}
                className="modal-close-btn"
                onClick={close}
                marginY={2}
                cursor={'pointer'}
                size="s8"
                color={'grey'}
                icon={'close'}
              />
            )}
            {children}
          </Flex>
        </motion.div>
      </Flex>
    </motion.div>
  );
};

export default Modal;
