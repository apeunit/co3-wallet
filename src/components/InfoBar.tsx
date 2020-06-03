import React from 'react';
import { Flex } from 'rebass';

const InfoBar = (props: any) => {
  const { children, border, ...rest } = props;
  const other = Array.isArray(children) ? children.slice(1) : children;

  return (
    <Flex
      paddingX={6}
      alignItems="center"
      paddingY={5}
      sx={{
        borderColor: 'gray100',
        borderBottomWidth: border ? '1px' : '0',
      }}
      {...rest}
    >
      <Flex
        width="s12"
        sx={{
          flexShrink: 0,
        }}
      >
        {Array.isArray(children) ? children[0] : null}
      </Flex>
      {other}
    </Flex>
  );
};

export default InfoBar;
