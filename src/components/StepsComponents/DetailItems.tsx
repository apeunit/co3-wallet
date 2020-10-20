import React from 'react';
import { Flex, Text } from 'rebass';
import IconButton from '../IconButton';
import { useTranslation } from 'react-i18next';

interface IProps {
  handleEdit: any;
  title: string;
  value: string | JSX.Element;
}

const DetailItems: React.FC<IProps> = ({ handleEdit, title, value }) => {
  const { t } = useTranslation();

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
          {t('common.edit')}
        </Text>
      </Flex>
      <Text fontSize={16} marginTop="7px">
        {title === t('common.contract') ? (
          <Flex className="token-file-icon" flexDirection="row">
            <IconButton icon="fileCopy" width="21px" height="14px" marginRight="5px" />
            <Text fontSize={16}>{value}</Text>
          </Flex>
        ) : (
          value
        )}
      </Text>
    </Flex>
  );
};

export default DetailItems;
