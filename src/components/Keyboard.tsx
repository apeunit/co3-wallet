import React from 'react';
import { Box, Flex, Text } from 'rebass';
import IconButton from './IconButton';
import ErrorMsg from './ErrorMsg';

const KeyButton = (props: any) => {
  const { label, onClick, disabled, ...rest } = props;

  const handleClick = () => {
    if (disabled) {
      return;
    } else {
      return onClick();
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center" onClick={handleClick} {...rest}>
      <Flex justifyContent="center" alignItems="center" size="s14">
        <Text fontFamily="sans" fontSize={4} fontWeight="regular">
          {label}
        </Text>
      </Flex>
    </Flex>
  );
};

const BackButton = (props: any) => {
  return (
    <Flex justifyContent="center" alignItems="center" {...props}>
      <IconButton size="s14" icon="backspace" backgroundColor="transparent" />
    </Flex>
  );
};

const ConfirmButton = (props: any) => {
  return (
    <Flex justifyContent="center" alignItems="center" {...props}>
      <IconButton size="s14" icon="check" color="white" backgroundColor="blue500" />
    </Flex>
  );
};

const Keyboard = (props: any) => {
  const { marginBottom, handleTap, handleErase, handleConfirm, error, disable, disbaleConfirm } = props;

  return (
    <Box
      height="s64"
      paddingTop={8}
      sx={{
        display: 'grid',
        gridTemplateRows: 'repeat(4,1fr)',
        gridTemplateColumns: 'repeat(4,1fr)',
        borderColor: 'gray100',
        borderTopWidth: '1px',
        position: 'relative',
      }}
      marginBottom={marginBottom}
    >
      {error && (
        <ErrorMsg
          style={{
            opacity: '0.8',
            position: 'absolute',
            left: '40%',
            top: '78%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
          title={error}
          type="error"
        />
      )}
      <KeyButton
        label="1"
        disabled={disable}
        onClick={() => {
          handleTap('1');
        }}
      />
      <KeyButton
        label="2"
        disabled={disable}
        onClick={() => {
          handleTap('2');
        }}
      />
      <KeyButton
        label="3"
        disabled={disable}
        onClick={() => {
          handleTap('3');
        }}
      />
      <BackButton
        onClick={() => {
          handleErase();
        }}
      />
      <KeyButton
        label="4"
        disabled={disable}
        onClick={() => {
          handleTap('4');
        }}
      />
      <KeyButton
        label="5"
        disabled={disable}
        onClick={() => {
          handleTap('5');
        }}
      />
      <KeyButton
        label="6"
        disabled={disable}
        onClick={() => {
          handleTap('6');
        }}
      />
      <KeyButton
        label="&#8226;"
        disabled={disable}
        onClick={() => {
          handleTap('.');
        }}
      />
      <KeyButton
        label="7"
        disabled={disable}
        onClick={() => {
          handleTap('7');
        }}
      />
      <KeyButton
        label="8"
        disabled={disable}
        onClick={() => {
          handleTap('8');
        }}
      />
      <KeyButton
        label="9"
        disabled={disable}
        onClick={() => {
          handleTap('9');
        }}
      />

      <KeyButton
        label="0"
        disabled={disable}
        sx={{
          gridRow: '4 / 5',
          gridColumn: '2 / 3',
        }}
        onClick={() => {
          handleTap('0');
        }}
      />
      <div />
      {disbaleConfirm && (
        <ConfirmButton
          sx={{
            gridRow: '4 / 5',
            gridColumn: '4 / 5',
          }}
          onClick={handleConfirm}
        />
      )}
    </Box>
  );
};

export default Keyboard;
