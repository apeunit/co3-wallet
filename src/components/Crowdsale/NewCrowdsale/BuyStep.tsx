import React from 'react';
import { Flex, Image, Text } from 'rebass';
import IconButton from '../../IconButton';
import { Divider } from '@material-ui/core';
import FramerSlide from '../../FrameMotion/Slide';
import { useTranslation } from 'react-i18next';
import ImageCard from 'src/components/ImageCard';
import itemSold from '../../../images/itemSold.png';
import maxSupply from '../../../images/maxSupply.png';
import prizeInstance from '../../../images/prizeInstance.svg';
import crowdsaleToken from '../../../images/crowdsale_token.svg';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { getTokenName } from 'src/api/co3uum';

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
          {data.contractLabel && (
            <>
              <Flex padding={5}>
                <Flex className="token-file-icon" flexDirection="row">
                  <IconButton
                    cursor={'default'}
                    icon="insertDriveFile"
                    width="16px"
                    height="20px"
                    className="crowdsale-detail-icon"
                    marginRight="20px"
                  />
                  <Text fontSize={16}>{data.contractLabel}</Text>
                </Flex>
              </Flex>
              <Divider />
            </>
          )}
          <Flex padding={5}>
            <Flex width="100%" justifyContent="space-between" flexDirection="row">
              <Flex>
                <Image width="20px" height="20px" margin="5px 16px 0px -1px" src={itemSold} />
                <Text fontSize={16}>{t('new_crowdsale.item_sold')}</Text>
              </Flex>
              <Text marginTop="3px" fontSize={13}>
                {getTokenName(tokenList, data.itemToSell)}
              </Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex padding={5}>
            <Flex width="100%" justifyContent="space-between" flexDirection="row">
              <Flex>
                <Image width="13px" height="14px" margin="5px 20px 0px 2px" src={maxSupply} />
                <Text fontSize={16}>{t('new_crowdsale.max_supply')}</Text>
              </Flex>
              <Text marginTop="3px" fontSize={13}>
                {data.maxSupply}
              </Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex padding={5}>
            <Flex
              className="token-file-icon"
              width="100%"
              justifyContent="space-between"
              flexDirection="row"
            >
              <Flex marginTop="7px">
                <IconButton
                  cursor={'default'}
                  icon="dateRange"
                  width="16px"
                  height="20px"
                  className="crowdsale-detail-icon"
                  marginRight="20px"
                />
                <Text fontSize={16}>{t('new_crowdsale.campaign_duration')}</Text>
              </Flex>
              <Flex width="83px" flexDirection="column">
                <Text textAlign="right" fontSize={13}>
                  <Moment utc={true} local={true} format="DD/MM/YYYY">
                    {data.startDate}
                  </Moment>
                </Text>
                <Text textAlign="right" fontSize={13}>
                  -{' '}
                  <Moment utc={true} local={true} format="DD/MM/YYYY">
                    {data.endDate}
                  </Moment>
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Divider />
          <Flex padding={5}>
            <Flex width="100%" justifyContent="space-between" flexDirection="row">
              <Flex>
                <Image width="19px" height="16px" margin="5px 17px 0px 0px" src={prizeInstance} />
                <Text fontSize={16}>{t('new_crowdsale.give_ratio')}</Text>
              </Flex>
              <Text marginTop="3px" fontSize={13}>
                {data.giveRatio}
              </Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex padding={5}>
            <Flex width="100%" justifyContent="space-between" flexDirection="row">
              <Flex>
                <Image width="20px" height="20px" margin="3px 15px 0px 0px" src={crowdsaleToken} />
                <Text fontSize={16}>{t('new_crowdsale.payment_token')}</Text>
              </Flex>
              <Text marginTop="3px" fontSize={13}>
                {getTokenName(tokenList, data.token)}
              </Text>
            </Flex>
          </Flex>
          <Divider />
          {/* <Flex padding={5}>
            <Flex width="100%" justifyContent="space-between" flexDirection="row">
              <Flex>
                <IconButton
                  cursor={'default'}
                  icon="locationOn"
                  width="16px"
                  height="20px"
                  className="crowdsale-detail-icon"
                  marginRight="20px"
                />
                <Text fontSize={16}>{t('new_crowdsale.location')}</Text>
              </Flex>
              <Text marginTop="3px" fontSize={13}>
                {data.location}
              </Text>
            </Flex>
          </Flex> */}
        </Flex>
      </Flex>
    </FramerSlide>
  );
};

export default BuyStep;
