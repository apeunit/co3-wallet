import React from 'react';
import { Flex, Image, Text } from 'rebass';
import image404 from '../images/404.png';
import IconButton from 'src/components/IconButton';
import { useHistory } from 'react-router-dom';

const NotFound404 = () => {
  const history = useHistory();

  return (
    <Flex height="100vh">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        paddingY={4}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 100 }}
      >
        <IconButton onClick={() => history.push('/')} sx={{ cursor: 'pointer' }} icon="back" />
        <Text>CO3 Wallet</Text>
        <IconButton onClick={() => history.push('/')} sx={{ cursor: 'pointer' }} icon="close" />
      </Flex>
      <Image height="265px" sx={{ margin: 'auto' }} src={image404} />
    </Flex>
  );
};

export default NotFound404;
