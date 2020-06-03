import React, { useState } from 'react';
import { addParameters } from '@storybook/react';
import { Button, Text } from 'rebass';
import Modal from '../components/Modal';
import { AnimatePresence } from 'framer-motion';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Input } from '@rebass/forms';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

export default {
  title: 'Modal',
  component: Modal,
};

export const Base = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" marginX="auto" m={5} onClick={() => setIsOpen(true)}>
        Open me
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal close={() => setIsOpen(false)}>
            <Text variant="heading" textAlign="center">
              Failure
            </Text>
            <Text variant="base" textAlign="center" marginTop={4}>
              Failure to connect to Ethereum blockchain
            </Text>
            <Input
              id="token"
              name="token"
              type="text"
              placeholder="0xD76b5c2A23ef78368d8E34288B5b65D616B746aE"
            />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};
