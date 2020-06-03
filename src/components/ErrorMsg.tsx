import React from 'react';
import { Flex, Text } from 'rebass';
import IconButton from './IconButton';
import { motion } from 'framer-motion';

const shake = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.15 } },
};
interface IProps {
  title: string;
  type: string;
  style?: any;
}

const ErrorMsg: React.FC<IProps> = ({ title, type, style }) => {
  const NofificationColor = type === 'error' ? '#FFF5F7' : 'rgba(253, 247, 187, .5)';
  const NofificationBorder = type === 'error' ? '#FFEBEF' : '#FDF7BB';
  const IconColor = type === 'error' ? '#F00034' : '#FBD117';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      style={{
        position: 'fixed',
        top: '70%',
        left: '50%',
        transform: 'translate(-50%,0)',
        ...style,
      }}
    >
      <motion.div variants={shake} transition={{ duration: 0.2 }}>
        <Flex
          width="max-content"
          paddingLeft={4}
          paddingRight={30}
          margin="0px auto"
          backgroundColor={NofificationColor}
          sx={{ borderRadius: 'full', borderColor: NofificationBorder, borderWidth: '1px' }}
        >
          <IconButton color={IconColor} icon="errorIcon" />
          <Text marginTop="11px" color="#4D0011">
            {title}
          </Text>
        </Flex>
      </motion.div>
    </motion.div>
  );
};

export default ErrorMsg;
