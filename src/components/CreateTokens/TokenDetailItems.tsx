import React from 'react';
import { Flex, Text } from 'rebass';
import IconButton from '../IconButton';

interface IProps {
  handleEdit: any;
  title: string;
  value: string;
}

const TokenDetailItems: React.FC<IProps> = ({ handleEdit, title, value }) => {
  return (
    <Flex padding={5} flexDirection="column" width="100%">
      <Flex width="100%" flexDirection="row" justifyContent="space-between">
        <Text fontSize={13} color="#9399A2">
          {title}
        </Text>
        <Text
          sx={{ cursor: 'pointer' }}
          onClick={() => handleEdit(title)}
          fontSize={13}
          color="blue600"
        >
          Edit
        </Text>
      </Flex>
      <Text fontSize={13} marginBottom={15} marginTop={25}>
        {title === 'Contract' ? (
          <Flex className="token-file-icon" flexDirection="row">
            <IconButton icon="fileCopy" width="21px" height="14px" marginRight="5px" />
            <Text fontSize={13}>{value}</Text>
          </Flex>
        ) : (
          value
        )}
      </Text>
    </Flex>
  );
};

export default TokenDetailItems;
