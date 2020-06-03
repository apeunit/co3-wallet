import React from 'react';
import { Text } from 'rebass';

const Badge = (props: any) => {
  const { children, ...rest } = props;

  return (
    <Text
      {...rest}
      fontFamily="sans"
      fontSize={0}
      fontWeight="medium"
      lineHeight={1}
      py="1"
      px="2"
      sx={{
        letterSpacing: 'xTracked',
        borderRadius: 'r1',
        borderColor: 'current',
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      {children}
    </Text>
  );
};

export default Badge;
