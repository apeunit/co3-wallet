import React from 'react';
import { Flex, Text } from 'rebass';
import TokenCard from '../TokenCard';
import IconButton from '../IconButton';
import { Divider } from '@material-ui/core';
import FramerSlide from '../../components/FrameMotion/Slide';

interface IProps {
  data: any;
}

const CreateTokenBuyStep: React.FC<IProps> = ({ data }) => {
  return (
    <FramerSlide>
      <Flex flexDirection="column" width="100%" style={{ transform: 'translateY(-30px)' }}>
        <TokenCard
          type="add"
          name={data.name}
          symbol={data.symbol}
          icon={data.icon}
          uploading={false}
        />
        {(data.headline || data.couponType) && (
          <Flex marginTop="10px" flexDirection="column" paddingX="15px">
            <Flex flexDirection="column" paddingBottom="20px">
              <Text fontSize={24}>{data.name}</Text>
              <Text fontSize={16} color="#757575">
                {data.headline}
              </Text>
            </Flex>
            <Text fontSize={16}>{data.description}</Text>
          </Flex>
        )}
        <Divider />
        {data.contractLabel && (
          <>
            <Flex padding={5}>
              <Flex className="token-file-icon" flexDirection="row">
                <IconButton
                  cursor={'default'}
                  icon="fileCopy"
                  width="21px"
                  height="14px"
                  marginRight="5px"
                />
                <Text fontSize={13}>{data.contractLabel}</Text>
              </Flex>
            </Flex>
            <Divider />
          </>
        )}
        <Flex padding={5} flexDirection="row" justifyContent="space-between">
          <Flex className="token-file-icon" flexDirection="row">
            <IconButton
              cursor={'default'}
              width="18px"
              height="15px"
              marginRight="7px"
              icon="totalSupply"
            />
            {data.tokenType === 'Mintable Token' || data.couponType === 'Mintable Coupon' ? (
              <Text fontSize={13}>{data.tokenType || data.couponType}</Text>
            ) : (
              <Text fontSize={13}>Total Supply</Text>
            )}
          </Flex>
          {(data.tokenType !== 'Mintable Token' || data.couponType !== 'Mintable Coupon') && (
            <Text fontSize={13}>{data.totalSupply}</Text>
          )}
        </Flex>
        <Divider />
      </Flex>
    </FramerSlide>
  );
};

export default CreateTokenBuyStep;
