import React from 'react';
import { Box, Flex, Text } from 'rebass';
import { Divider } from '@material-ui/core';
import Avatar from '../Avatar';
import DetailItems from './DetailItems';
import FramerSlide from '../FrameMotion/Slide';
import { useTranslation } from 'react-i18next';
import ImageCard from 'src/components/ImageCard';
import { useSelector } from 'react-redux';
import { getTokenName } from 'src/utils/helper';
import Moment from 'react-moment';

interface IProps {
  data: any;
  handleEdit: any;
  uploading?: boolean;
  handleChangeIcon?: any;
}

const CreateDetailStep: React.FC<IProps> = ({ data, handleEdit, uploading, handleChangeIcon }) => {
  const { t } = useTranslation();
  const { tokenList } = useSelector(({ chain }: any) => {
    return {
      tokenList: chain.tokenList,
    };
  });

  return (
    <FramerSlide>
      <Box
        style={{
          overflowY: 'scroll',
          width: '100vw',
          height: '85vh',
          margin: data.maxSupply ? '0px' : '10vh -20px 0',
        }}
      >
        <Flex flexDirection="column">
          {data.maxSupply ? (
            <Flex width="100%">
              <ImageCard
                name=""
                symbol=""
                icon={data.icon}
                onChange={handleChangeIcon}
                uploading={uploading}
                type="add"
                uploadIcon="crowdsale"
                alignItems="center"
                style={{
                  width: '97%',
                  marginBottom: '10px',
                  alignContent: 'center',
                  justifyContent: 'flex-end !important',
                }}
              />
            </Flex>
          ) : (
            <>
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
            </>
          )}
          <DetailItems handleEdit={handleEdit} title={t('common.name')} value={data.name} />
          <Divider />
          {!data.maxSupply && data.symbol && (
            <>
              <DetailItems handleEdit={handleEdit} title={t('common.symbol')} value={data.symbol} />
              <Divider />
            </>
          )}
          {!data.maxSupply && data.productsAvailable && (
            <>
              <DetailItems handleEdit={handleEdit} title={t('new_pickupbox.product_available')} value={data.productsAvailable} />
              <Divider />
            </>
          )}
          {!data.maxSupply && data.couponToGive && (
            <>
              <DetailItems handleEdit={handleEdit} title={t('new_pickupbox.coupon_to_give')} value={data.couponToGive} />
              <Divider />
            </>
          )}
          <DetailItems
            handleEdit={handleEdit}
            title={t('common.short_description')}
            value={data.description}
          />
          <Divider />
          {data.contractLabel && (
            <>
              <DetailItems
                handleEdit={handleEdit}
                title={t('common.contract')}
                value={data.contractLabel}
              />
              <Divider />
            </>
          )}
          {data.maxSupply && (
            <>
              <DetailItems
                handleEdit={handleEdit}
                title={t('new_crowdsale.max_supply')}
                value={data.maxSupply}
              />
              <Divider />
              <DetailItems
                handleEdit={() => handleEdit(t('new_crowdsale.campaign_date'))}
                title={t('new_crowdsale.campaign_start')}
                value={
                  <Moment utc={true} local={true} format="DD/MM/YYYY">
                    {data.startDate}
                  </Moment>
                }
              />
              <Divider />
              <DetailItems
                handleEdit={() => handleEdit(t('new_crowdsale.campaign_date'))}
                title={t('new_crowdsale.campaign_end')}
                value={
                  <Moment utc={true} local={true} format="DD/MM/YYYY">
                    {data.endDate}
                  </Moment>
                }
              />
              <Divider />
              <DetailItems
                handleEdit={handleEdit}
                title={t('new_crowdsale.give_ratio')}
                value={data.giveRatio}
              />
              <Divider />
              <DetailItems
                handleEdit={handleEdit}
                title={t('asset_popup.token')}
                value={getTokenName(tokenList, data.token)}
              />
              <Divider />
              <DetailItems
                handleEdit={handleEdit}
                title={t('new_crowdsale.item_sold')}
                value={getTokenName(tokenList, data.itemToSell)}
              />
              <Divider />
            </>
          )}
        </Flex>
      </Box>
    </FramerSlide>
  );
};

export default CreateDetailStep;
