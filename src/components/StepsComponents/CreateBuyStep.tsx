import React from 'react';
import { Flex, Image, Text } from 'rebass';
import TokenCard from '../Tokens/CreateTokens/TokenCard';
import IconButton from '../IconButton';
import { Divider } from '@material-ui/core';
import FramerSlide from '../FrameMotion/Slide';
import { useTranslation } from 'react-i18next';
import CouponImageCard from '../Coupons/CreateCoupon/CouponImageCard';
import totalSupplySvg from '../../images/supply.svg';

interface IProps {
  data: any;
}

const CreateBuyStep: React.FC<IProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <FramerSlide>
      <Flex flexDirection="column" width="100%" style={{ overflow: 'scroll', maxHeight: '80vh', marginBottom: '10px', transform: `translateY(${data.headline ? '-20px' : '-30px'})` }}>
        {data.headline ? (
          <CouponImageCard
            coupon={data}
            handleChangeIcon={null}
            uploading={false}
            error=""
            icon={data.icon}
          />
        ) :(
          <TokenCard
            type="add"
            name={data.name}
            symbol={data.symbol}
            icon={data.icon}
            uploading={false}
          />
        )}
        {!data.headline && data.description && (
          <>
            <Flex padding={5}>
              <Flex className="token-file-icon" flexDirection="row">
                <Text fontSize={13}>{data.description}</Text>
              </Flex>
            </Flex>
            <Divider />
          </>
        )}
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
              <Flex className="token-file-icon" width="100%" flexDirection="row" justifyContent="space-between">
                <Flex flexDirection="row">
                  <Image width="13px" height="14px" margin="5px 10px 0px 2px" src={totalSupplySvg} />
                  <Text fontSize={13}>Total Supply</Text>
                </Flex>
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
