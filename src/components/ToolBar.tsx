import React from 'react';
import { Flex } from 'rebass';

const ToolBar = (props: any) => {
  const { children, ...rest } = props;

  return (
    <Flex width="100%" alignItems="center" paddingTop={4} paddingX={2} {...rest}>
      {children}
    </Flex>
  );
};

export default ToolBar;
