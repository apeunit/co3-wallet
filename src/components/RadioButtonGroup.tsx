import React from 'react';
import { Flex } from 'rebass';
import RadioButton from './RadioButton';

const RadioButtonGroup = (props: any) => {
  const { radios, gap, iconColor, loading, iconBg, ...rest } = props;

  return (
    <Flex flexDirection="column" {...rest}>
      {radios.map((radio: any, index: number) => {
        return <RadioButton {...radio} value={props.value} onChange={props.onChange} key={index} />;
      })}
    </Flex>
  );
};

export default RadioButtonGroup;
