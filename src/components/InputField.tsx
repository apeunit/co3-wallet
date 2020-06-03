import React, { useEffect, useState } from 'react';
import { Flex, Text } from 'rebass';
import { Input, Label } from '@rebass/forms';

const InputField = (props: any) => {
  const {
    value,
    onChangeValue,
    label,
    placeholder,
    maxLength,
    msg,
    type,
    notification,
    handleKeyChange,
  } = props;
  const [textCount, setTextCount] = useState(0);
  const [err, setErr] = useState(false);
  const divRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setTextCount(value.length);
    }
  }, [notification, value]);

  useEffect(() => {
    if (notification && divRef.current) {
      divRef.current.focus();
    }
  }, [notification]);

  const handleChange = (e: any) => {
    setErr(false);
    if (maxLength && e.target.value.length <= maxLength) {
      setTextCount(e.target.value.length);
      onChangeValue(e.target.value);
      setErr(false);
    } else if (!maxLength) {
      onChangeValue(e.target.value);
      setErr(false);
    }
  };

  const handleFocus = () => {
    setErr(false);
  };

  return (
    <Flex flexDirection="column" width="100%" sx={{ color: err ? 'red' : 'blue600' }}>
      <Label fontSize={1} htmlFor="email">
        {label}
      </Label>
      <Input
        onChange={handleChange}
        onFocus={handleFocus}
        value={value}
        padding={0}
        paddingY={4}
        ref={divRef}
        sx={{
          border: 'none',
          borderBottom: '1px solid',
          borderBottomColor: err ? 'red' : '#3849ff',
          color: err ? 'red' : 'black',
          outline: 'none',
        }}
        id={label}
        name={label}
        type={type}
        disabled={placeholder === 'coupon symbol'}
        placeholder={placeholder}
        autoFocus={msg === 'focusFalse' ? false : true}
        onKeyUp={handleKeyChange}
      />
      <Flex justifyContent="space-between" paddingY={2}>
        <Text fontSize={1} color="#ccc">
          {msg === 'focusFalse' ? '' : msg}
        </Text>
        {maxLength && (
          <Text fontSize={1} sx={{ color: err ? 'red' : '#ccc' }}>
            {`${textCount}/${maxLength}`}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default InputField;
