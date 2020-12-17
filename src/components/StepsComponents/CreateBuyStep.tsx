import React from 'react';
import { Flex, Text } from 'rebass';
import TokenCard from '../Tokens/CreateTokens/TokenCard';
import IconButton from '../IconButton';
import { Divider } from '@material-ui/core';
import FramerSlide from '../FrameMotion/Slide';
import { useTranslation } from 'react-i18next';

interface IProps {
  data: any;
}

const CreateBuyStep: React.FC<IProps> = ({ data }) => {
  const { t } = useTranslation();

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
        {data.headline && (
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
                  marginTop="-2px"
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
              marginTop="-2px"
              marginRight="7px"
              icon="totalSupply"
            />
            <Text fontSize={13}>
              {data.headline ? t('new_coupon.mintable_coupon') : t('common.mintable_token')}
            </Text>
          </Flex>
        </Flex>
        {data?.totalCoupon && (
          <Flex padding={5} flexDirection="row" justifyContent="space-between">
            <Flex className="token-file-icon" flexDirection="row">
              <IconButton
                cursor={'default'}
                width="18px"
                height="15px"
                marginTop="-2px"
                marginRight="7px"
                icon="totalSupply"
              />
              <Text fontSize={13}>{data?.totalCoupon ? data?.totalCoupon : ''}</Text>
            </Flex>
          </Flex>
        )}
        <Divider />
        {data.totalSupply && (
          <>
            <Flex padding={5}>
              <Flex className="token-file-icon" flexDirection="row">
                <IconButton
                  cursor={'default'}
                  icon="totalSupply"
                  width="21px"
                  marginTop="-2px"
                  height="14px"
                  marginRight="5px"
                />
                <Text fontSize={13}>{data.totalSupply}</Text>
              </Flex>
            </Flex>
            <Divider />
          </>
        )}
      </Flex>
    </FramerSlide>
  );
};

export default CreateBuyStep;
