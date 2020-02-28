import React from 'react';
import { useState } from "react";
import { addParameters } from '@storybook/react';
import { Flex, Text, Button} from 'rebass'
import Modal from '../components/Modal'
import { AnimatePresence } from "framer-motion";
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

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
    return(
        <>
        <Button 
            variant='primary' 
            marginX='auto' 
            m={5}
            onClick={() => setIsOpen(true)}
        >
            Open me
        </Button>
        <AnimatePresence>
            {isOpen && 
                <Modal close={() => setIsOpen(false)} >
                    <Text variant="heading" textAlign='center' >
                        Lorem ipsum
                    </Text>
                    <Text variant="base" textAlign='center' marginTop={4}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dapibus consequat ante, vitae rutrum libero
                    </Text>
                </Modal>
            }
        </AnimatePresence>
      </>
    )
}


