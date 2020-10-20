import React, { useEffect, useState } from 'react';
import { Flex, Text } from 'rebass';
import { Label, Textarea } from '@rebass/forms';

const TextArea = (props: any) => {
  const {
    value,
    onChangeValue,
    onFocus,
    label,
    placeholder,
    maxLength,
    msg,
    className,
    defaultRows = 0,
  } = props;
  const [textCount, setTextCount] = useState(0);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (value) {
      setTextCount(value.length);
    }
  }, [value]);

  const onChange = (e: any) => {
    if (e.target.value.length <= maxLength) {
      setTextCount(e.target.value.length);
      onChangeValue(e.target.value);
      setErr(false);
    }
    if (e.target.value.length === 0) {
      setErr(true);
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100%"
      sx={{ color: err ? 'red' : 'blue600' }}
      margin="0"
      style={{ position: 'relative' }}
    >
      <Label fontSize={1}>{label}</Label>
      <Textarea
        onChange={onChange}
        onFocus={onFocus}
        value={value}
        padding={0}
        rows={defaultRows}
        sx={{
          border: 'none',
          borderBottom: '1px solid',
          borderBottomColor: err ? 'red' : '#3849ff',
          color: err ? 'red' : 'black',
          outline: 'none',
        }}
        id="description"
        name={label}
        placeholder={placeholder}
        autoFocus={true}
        className={className}
      />
      <Flex justifyContent="space-between" paddingY={2}>
        <Text fontSize={1} color="#a2a2a2">
          {msg}
        </Text>
        <Text fontSize={1} sx={{ color: err ? 'red' : '#a2a2a2' }}>
          {`${textCount}/${maxLength}`}
        </Text>
      </Flex>
    </Flex>
  );
};

export default TextArea;
