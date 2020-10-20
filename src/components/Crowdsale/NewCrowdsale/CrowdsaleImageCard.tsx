import React from 'react';
import { Flex, Text } from 'rebass';
import FramerSlide from '../../FrameMotion/Slide';
import ImageCard from '../../ImageCard';
import ErrorMsg from '../../ErrorMsg';
import avatarImg from '../../../images/img_default.png';
import { useTranslation } from 'react-i18next';

interface IProps {
  handleChangeIcon: any;
  crowdsale: any;
  uploading: boolean;
  error: string;
  icon: any;
}

const CrowdsaleImageCard: React.FC<IProps> = ({
  handleChangeIcon,
  crowdsale,
  uploading,
  error,
}) => {
  const getImg = '';
  const { t } = useTranslation();

  return (
    <FramerSlide>
      <Flex flexDirection="column" width="100%" height="80%">
        <Flex flexDirection="column" width="100%" justifyContent="space-between">
          <ImageCard
            name=""
            symbol=""
            icon={crowdsale.icon ? crowdsale.icon : avatarImg}
            onChange={handleChangeIcon}
            uploading={uploading}
            getImg={getImg}
            type="add"
            uploadIcon="crowdsale"
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
          <Text color="#a2a2a2" fontSize={12}>
            {t('new_crowdsale.campaign_image')}
          </Text>
        </Flex>
      </Flex>
    </FramerSlide>
  );
};

export default CrowdsaleImageCard;
