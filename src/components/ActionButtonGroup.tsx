import React from 'react';
import { Flex } from 'rebass';
import ActionButton from './ActionButton';

const ActionButtonGroup = (props: any) => {
  const { buttons, gap, iconColor, loading, iconBg, iconBorderColor, ...rest } = props;

  return (
    <Flex width="auto" {...rest}>
      {buttons.map((button: any, index: number) => {
        return (
          <ActionButton
            {...button}
            sx={{ cursor: 'pointer' }}
            key={index}
            marginX={gap ? gap : 0}
            iconBorderColor={button.iconBorderColor}
            iconColor={button.iconColor}
            iconBg={button.iconBg}
            loading={loading}
          />
        );
      })}
    </Flex>
  );
};

export default ActionButtonGroup;
