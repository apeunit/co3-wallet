import React from 'react';
import { Flex, Text } from 'rebass';
import FramerSlide from '../../FrameMotion/Slide';
import ImageCard from '../../ImageCard';
import ErrorMsg from '../../ErrorMsg';

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

  return (
    <FramerSlide>
      <Flex flexDirection="column" width="100%" height="80%">
        <Flex flexDirection="column" width="100%" justifyContent="space-between">
          {handleChangeIcon ? (
            <ImageCard
              name=""
              symbol=""
              icon={coupon.icon}
              onChange={handleChangeIcon}
              uploading={uploading}
              type="add"
              alignItems="center"
              style={{
                alignContent: 'center',
                justifyContent: 'flex-end !important',
              }}
            />
          ) : (
            <Flex sx={{ borderRadius: 8, overflow: 'hidden' }} width="94%" marginX="auto" maxHeight="339px">
              <img src={coupon.icon} style={{ width: '100%', margin: 'auto', maxHeight: '339px', maxWidth: '339px', height: 'auto' }} alt="CouponImage" />
            </Flex>
          )}
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
