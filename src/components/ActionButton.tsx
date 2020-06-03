import React from 'react';
import { Flex, Text } from 'rebass';
import IconButton from './IconButton';
import ActionButtonPlaceholder from '../components/ActionButtonPlaceholder';

const ActionButton = (props: any) => {
  const {
    icon,
    label,
    iconColor,
    iconBg,
    iconBorderColor = 'transparent',
    loading,
    ...rest
  } = props;

  return (
    <Flex>
      {loading ? (
        <ActionButtonPlaceholder />
      ) : (
        <>
          {!props.show && (
            <Flex flexDirection="column" alignItems="center" {...rest}>
              <IconButton
                marginX={3}
                size="s14"
                backgroundColor={iconBg ? iconBg : 'shadow'}
                color={iconColor ? iconColor : 'current'}
                icon={icon}
                sx={{
                  borderWidth: '1px',
                  borderColor: iconBorderColor,
                  borderRadius: 'full',
                }}
              />
              <Text
                marginTop={2}
                color={icon === 'mintIcon' ? iconColor : ''}
                variant="base"
                fontSize={1}
              >
                {label}
              </Text>
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};

export default ActionButton;
