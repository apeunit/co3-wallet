import React from 'react';
import { Button, Flex, Text } from 'rebass';
import { useTranslation } from 'react-i18next';
import { Divider } from '@material-ui/core';
import avatarImg from '../../images/default_user.png';
import AddImage from '../AddImage';
import { getProfileImageUrl } from 'src/api/co3uum';
import _get from 'lodash/get';
import { SSO_LOGIN_URL } from 'src/config';

const IdentityCard = (props: any) => {
  const { userData, loader } = props;
  const { t } = useTranslation();
  const handleLink = () => {
    window.location.assign(SSO_LOGIN_URL);
  };

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      width="100%"
      height="max-content"
      className="identity"
    >
      <Flex flexDirection="column" margin="20px auto 0px" className="identity-section" width="42vh">
        <Flex width="210px" margin="auto" flexDirection="column" justifyContent="center">
          <AddImage
            label={''}
            uploading={false}
            uploadIcon="hide"
            image={userData && userData.id ? getProfileImageUrl(userData) : avatarImg}
            placeholder={avatarImg}
            padding={0}
          />
          {!loader && _get(userData, 'name') ? (
            <Text margin="0px 0px 15px" style={{ textAlign: 'center' }}>
              {userData.name}
            </Text>
          ) : (
            <Button margin="0px 0px 15px" className="empty_btn" />
          )}
        </Flex>
        {!loader && !_get(userData, 'id') && <Divider />}
        {!loader && !_get(userData, 'id') && (
          <Flex flexDirection="column">
            <Text className="description">{t('settings.identity_msg')}</Text>
            <Button onClick={handleLink} className="link_btn">
              {t('settings.link')}
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default IdentityCard;
