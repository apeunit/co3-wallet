import React, { useState } from 'react';
import { Box, Flex, Text } from 'rebass';
import '../../assets/styles/Setting.css';
import InputField from '../InputField';

const PhraseBox = (props: any) => {
  const {
    id,
    text,
    type,
    onClick,
    autoFocus,
    handleKeyChange,
    phrases,
    setPhrases,
    setError,
    customRef,
    className,
    autoComplete,
  } = props;
  const [value, setValue] = useState('');

  const setPhrase = (newVal: string) => {
    id - 1 === 0
      ? setPhrases([newVal, ...phrases.slice(id)])
      : setPhrases([...phrases.slice(0, id - 1), newVal, ...phrases.slice(id)]);
  };

  const handleBlur = () => {
    if (value) {
      setError('');
      setPhrase(value);
    }
  };

  const onKeyChange = (e: any) => {
    e.preventDefault();
    if (e.key === 'Enter' && value) {
      handleKeyChange(e);
      handleBlur();
    }
  };

  const onchangeValue = (e: any) => {
    setValue(e);
    setError('');
  };

  return (
    <Flex
      onClick={onClick}
      width="100%"
      minWidth="max-content"
      marginY="10px"
      justifyContent="space-between"
    >
      {id && <Text marginTop="10px">{id}</Text>}
      {type === 'input' ? (
        <Box className={` ${type}-bg`}>
          <InputField
            type="text"
            value={value}
            onChangeValue={onchangeValue}
            label={''}
            placeholder={''}
            msg={''}
            id={id}
            handleBlur={handleBlur}
            customRef={customRef}
            className={className}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            handleKeyChange={onKeyChange}
          />
        </Box>
      ) : text ? (
        <Box style={{ position: 'relative' }} className={`phrase-box ${type}-bg`}>
          <Text>{text}</Text>
        </Box>
      ) : (
            <Box className="phrase-box-empty" />
          )}
    </Flex>
  );
};

export default PhraseBox;
