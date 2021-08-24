import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Flex, Image, Text } from 'rebass';
import { Divider } from '@material-ui/core';

import { getTokenName } from 'src/utils/helper';
import IconButton from '../../IconButton';
import FramerSlide from '../../FrameMotion/Slide';
import ImageCard from 'src/components/ImageCard';

import totalSupplySvg from '../../../images/supply.svg';

interface IProps {
  data: any;
}

const BuyStep: React.FC<IProps> = ({ data }) => {
  const { t } = useTranslation();
  const { tokenList } = useSelector(({ chain }: any) => {
    return {
      tokenList: chain.tokenList,
    };
  });

  return (
    <FramerSlide customStyle={{ height: '80%', position: 'absolute', top: '55px', width: '92%' }}>
      <Flex flexDirection="column" width="100%" justifyContent="start">
        <ImageCard
          name=""
          symbol=""
          icon={data.icon}
          uploading={false}
          type=""
          uploadIcon="crowdsale"
          alignItems="center"
          style={{
            alignContent: 'center',
            justifyContent: 'flex-end !important',
          }}
        />
        <Flex marginTop="10px" marginBottom="10px" flexDirection="column" paddingX="15px">
          <Flex flexDirection="column" paddingBottom="5px">
            <Text fontSize={24}>{data.name}</Text>
          </Flex>
          <Text fontSize={16}>{data.description}</Text>
        </Flex>
        <Divider />
        <Flex flexDirection="column" width="100%" style={{ overflow: 'scroll', height: '60%' }}>
          <Flex padding={5}>
            <Flex width="100%" justifyContent="space-between" flexDirection="row">
              <Flex>
                <IconButton
                  cursor={'default'}
                  icon="coupen"
                  width="16px"
                  height="20px"
                  className="crowdsale-detail-icon"
                  marginRight="17px"
                />
                <Text fontSize={16}>{t('new_pickupbox.coupon_to_give')}</Text>
              </Flex>
              <Text marginTop="3px" fontSize={13}>
                {getTokenName(tokenList, data.couponToGive)}
              </Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex padding={5}>
            <Flex width="100%" justifyContent="space-between" flexDirection="row">
              <Flex>
                <Image width="13px" height="14px" margin="5px 10px 0px 2px" src={totalSupplySvg} />
                <Text fontSize={16}>{t('new_pickupbox.product_available')}</Text>
              </Flex>
              <Text marginTop="3px" fontSize={13}>
                {data.productsAvailable}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </FramerSlide>
  );
};

export default BuyStep;
