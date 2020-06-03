import React from 'react';
import { Box, Flex } from 'rebass';
import Icon from './Icon';

const IconButton = (props: any) => {
  const { icon, onClick, cursor = 'pointer', ...rest } = props;

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      size="s12"
      sx={{
        position: 'relative',
        borderRadius: 'full',
        cursor: cursor,
      }}
      {...rest}
      onClick={onClick}
    >
      {props.dot && (
        <Box
          size="s2"
          sx={{
            position: 'absolute',
            bg: 'secondary',
            top: '50%',
            right: '50%',
            marginTop: -3,
            marginRight: -5,
            borderRadius: 'full',
          }}
        />
      )}
      <Box
        sx={{
          position: 'relative',
          pointerEvents: 'none',
        }}
      >
        <Icon name={icon} />
      </Box>
    </Flex>
  );
};

export default IconButton;
