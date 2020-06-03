import React from 'react';
import { Flex, Text } from 'rebass';
import FramerSlide from '../FrameMotion/Slide';
import ImageCard from '../ImageCard';
import ErrorMsg from '../ErrorMsg';

interface IProps {
  handleChangeIcon: any;
  coupon: any;
  uploading: boolean;
  error: string;
  icon: any;
}

const CouponImageCard: React.FC<IProps> = ({
  handleChangeIcon,
  coupon,
  uploading,
  error,
  icon,
}) => {
  const getImg = '';

  return (
    <FramerSlide>
      <Flex flexDirection="column" width="100%" height="80%">
        <Flex flexDirection="column" width="100%" justifyContent="space-between">
          <ImageCard
            name=""
            symbol=""
            icon={coupon.icon}
            onChange={handleChangeIcon}
            uploading={uploading}
            getImg={getImg}
            type="add"
            alignItems="center"
            style={{
              alignContent: 'center',
              justifyContent: 'flex-end !important',
            }}
          />
          <div>
            {error && (
              <ErrorMsg
                title={error}
                type="error"
                style={{ transform: 'translateX(-50%)', bottom: '40px', top: 'auto' }}
              />
            )}
          </div>
        </Flex>
        <Flex marginTop="10px" flexDirection="column" paddingX="15px">
          <Flex flexDirection="column" paddingBottom="20px">
            <Text fontSize={24}>{coupon.name}</Text>
            <Text fontSize={16} color="#757575">
              {coupon.headline}
            </Text>
          </Flex>
          <Text fontSize={16}>{coupon.description}</Text>
        </Flex>
      </Flex>
    </FramerSlide>
  );
};

export default CouponImageCard;
