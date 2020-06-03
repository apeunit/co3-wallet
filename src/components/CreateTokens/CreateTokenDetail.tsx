import React from 'react';
import { Flex, Text, Box } from 'rebass';
import { Divider } from '@material-ui/core';
import Avatar from '../Avatar';
import TokenDetailItems from './TokenDetailItems';
import FramerSlide from '../../components/FrameMotion/Slide';

interface IProps {
  data: any;
  handleEdit: any;
}

const CreateTokenDetail: React.FC<IProps> = ({ data, handleEdit }) => {
  return (
    <FramerSlide>
      <Box style={{ overflowY: 'scroll', width: "100vw", height: '82vh', margin: '10vh -20px 0' }} >
        <Flex flexDirection="column">
          <Flex padding={5} flexDirection="row" justifyContent="space-between">
            <Text fontSize={13} color="#9399A2">
              Icon
            </Text>
            <Avatar image={data.icon} size="110px" />
            <Text
              sx={{ cursor: 'pointer' }}
              onClick={() => handleEdit('Icon')}
              fontSize={13}
              color="blue600"
            >
              Edit
            </Text>
          </Flex>
          <Divider />
          <TokenDetailItems handleEdit={handleEdit} title={'Name'} value={data.name} />
          <Divider />
          <TokenDetailItems handleEdit={handleEdit} title={'Symbol'} value={data.symbol} />
          <Divider />
          <TokenDetailItems
            handleEdit={handleEdit}
            title={'Short description'}
            value={data.description}
          />
          <Divider />
          {data.contractLabel && (
            <>
              <TokenDetailItems
                handleEdit={handleEdit}
                title={'Contract'}
                value={data.contractLabel}
              />
              <Divider />
            </>
          )}
          <TokenDetailItems handleEdit={handleEdit} title={'Type'} value={data.contractType} />
          <Divider />
          {data.tokenType === 'Mintable Token' ? (
            <>
              <TokenDetailItems handleEdit={handleEdit} title={'Token Type'} value={data.tokenType} />
            </>
          ) : (
            <>
              <TokenDetailItems handleEdit={handleEdit} title={'Supply'} value={data.totalSupply} />
            </>
          )}
        </Flex>
      </Box>
    </FramerSlide>
  );
};

export default CreateTokenDetail;
