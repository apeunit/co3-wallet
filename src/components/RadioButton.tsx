import React from 'react';
import { Flex, Text } from 'rebass';
import { Label, Radio } from '@rebass/forms';
const RadioButton = (props: any) => {
  const { info, label, value, onChange } = props;

  return (
    <Flex flexDirection="column" marginBottom={8}>
      <Label fontSize="16px" color="#3191919">
        <Radio
          name="color"
          id={label}
          value={label}
          checked={label === value}
          onChange={onChange}
        />
        {label}
      </Label>
      <Text fontSize="13px" color="#8E949E" paddingX={10} marginTop={2}>
        {info}
      </Text>
    </Flex>
  );
};

export default RadioButton;
