import React from 'react';
import { Box, Flex, Text } from 'rebass';
import { Divider } from '@material-ui/core';
import Avatar from '../Avatar';
import TokenDetailItems from './TokenDetailItems';
import FramerSlide from '../../components/FrameMotion/Slide';
import { useTranslation } from 'react-i18next';

interface IProps {
  data: any;
  handleEdit: any;
}

const CreateTokenDetail: React.FC<IProps> = ({ data, handleEdit }) => {
  const { t } = useTranslation();

  return (
    <FramerSlide>
      <Box style={{ overflowY: 'scroll', width: '100vw', height: '82vh', margin: '10vh -20px 0' }} >
        <Flex flexDirection="column">
          <Flex padding={5} flexDirection="row" justifyContent="space-between">
            <Text fontSize={13} color="#9399A2">
              {t('common.icon')}
            </Text>
            <Avatar image={data.icon} size="110px" />
            <Text
              sx={{ cursor: 'pointer' }}
              onClick={() => handleEdit('Icon')}
              fontSize={13}
              color="blue600"
            >
              {t('common.edit')}
            </Text>
          </Flex>
          <Divider />
          <TokenDetailItems handleEdit={handleEdit} title={t('common.name')} value={data.name} />
          <Divider />
          <TokenDetailItems
            handleEdit={handleEdit}
            title={t('common.symbol')}
            value={data.symbol}
          />
          <Divider />
          <TokenDetailItems
            handleEdit={handleEdit}
            title={t('common.short_description')}
            value={data.description}
          />
          <Divider />
          {data.contractLabel && (
            <>
              <TokenDetailItems
                handleEdit={handleEdit}
                title={t('common.contract')}
                value={data.contractLabel}
              />
              <Divider />
            </>
          )}
          <TokenDetailItems
            handleEdit={handleEdit}
            title={t('new_token.type')}
            value={data.contractType}
          />
          <Divider />
          {data.tokenType === 'Mintable Token' ? (
            <>
              <TokenDetailItems
                handleEdit={handleEdit}
                title={t('new_token.token_type')}
                value={data.tokenType}
              />
            </>
          ) : (
            <>
              <TokenDetailItems
                handleEdit={handleEdit}
                title={t('common.supply')}
                value={data.totalSupply}
              />
            </>
          )}
        </Flex>
      </Box>
    </FramerSlide>
  );
};

export default CreateTokenDetail;
