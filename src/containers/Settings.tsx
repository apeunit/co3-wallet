import React, { useEffect, useState } from 'react';
import { Flex, Text } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import IdentityCard from 'src/components/Settings/IdentityCard';
import '../assets/styles/Setting.css';
import STFooter from 'src/components/SingleTokenComponents/STFooter';
import IconButton from 'src/components/IconButton';
import { Divider } from '@material-ui/core';
import { getPublicKey, getUserIDName } from 'src/api/co3uum';
import _get from 'lodash/get';
import { setPublicKey } from 'src/redux/actions/Wallet';
import { useHistory } from 'react-router-dom';
import { languages } from './TokenRadioText';
import { BACKUP_WALLET } from 'src/config';

const Settings: React.FC = () => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [loader, setLoader] = useState(true);
  const [userData, setUserData] = useState<any>({});
  const { accessToken, ethAddress } = useSelector(({ co3uum, wallet }: any) => {
    return {
      accessToken: co3uum.accessToken,
      ethAddress: wallet.ethAddress,
    };
  });

  const getUserdata = async () => {
    if (accessToken) {
      setLoader(true);
      try {
        const pbkey = await getPublicKey(accessToken);
        if (_get(pbkey, 'result.blockchain_public_key')) {
          dispatch(setPublicKey(_get(pbkey, 'result.blockchain_public_key')));
        }
        const data: any = await getUserIDName(accessToken);
        if (data) {
          setUserData(data.member);
          setLoader(false);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    getUserdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, ethAddress]);

  const selectedLanguage: any = languages.find((lng: any) => i18n.language === lng.code);

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="90vh"
      style={{ overflow: 'hidden' }}
      justifyContent="space-between"
      className="settings"
    >
      <Flex flexDirection="column" margin="0px">
        <IdentityCard userData={userData} loader={loader} />
        <Flex
          style={{ overflow: 'scroll' }}
          height={_get(userData, 'id') ? '100%' : '45vh'}
          flexDirection="column"
        >
          {/* Wallet Security */}
          <Flex flexDirection="column" margin="30px auto" width="42vh" className="identity-section">
            <Text className="label">{t('settings.wallet_security')}</Text>
            <Flex
              onClick={() => history.push('/new-wallet')}
              justifyContent="space-between"
              height="24px"
              margin="10px 0px"
            >
              <Text className="option">{t('settings.backup_wallet')}</Text>
              <Flex>
                {BACKUP_WALLET !== 'true' && (
                  <Text color="#ED6881" fontSize="12px" marginTop="5px">
                    {t('settings.backup_wallet_error')}
                  </Text>
                )}
                {BACKUP_WALLET !== 'true' ? (
                  <IconButton className="backup-red" icon="warning" />
                ) : (
                  <IconButton className="backup-green" icon="checkCircleRounded" />
                )}
              </Flex>
            </Flex>
            <Divider />
            <Flex
              onClick={() => history.push('/import-wallet')}
              justifyContent="space-between"
              height="24px"
              margin="10px 0px"
            >
              <Text className="option">{t('settings.import_wallet')}</Text>
              <IconButton className="option-icon" icon="arrowForward" />
            </Flex>
            <Divider />
            <Flex onClick={() => history.push('/delete-wallet')} justifyContent="space-between" height="24px" margin="10px 0px">
              <Text className="option">{t('settings.delete_wallet')}</Text>
              <IconButton
                className="option-icon"
                onClick={() => history.push('/delete-wallet')}
                icon="arrowForward"
              />
            </Flex>
            <Divider />
          </Flex>

          {/* Misk */}
          <Flex
            flexDirection="column"
            margin="0px auto 20px"
            width="42vh"
            className="identity-section"
          >
            <Text className="label">{t('settings.misc')}</Text>
            <Flex justifyContent="space-between" height="24px" margin="10px 0px">
              <Text className="option">{t('settings.language')}</Text>
              <Text width="60%" textAlign="end" color="#757575" fontSize="12px" marginTop="5px">
                {t(`settings.${(selectedLanguage && selectedLanguage.title) || 'english'}`)}
              </Text>
              <IconButton
                className="option-icon"
                onClick={() => history.push('/language')}
                icon="arrowForward"
              />
            </Flex>
            <Divider />
            <Flex justifyContent="space-between" height="24px" margin="10px 0px">
              <Text className="option disable">{t('settings.help')}</Text>
              <IconButton className="option-icon disable" icon="arrowForward" />
            </Flex>
            <Divider />
            <Flex justifyContent="space-between" height="24px" margin="10px 0px">
              <Text className="option disable">{t('settings.about')}</Text>
              <IconButton className="option-icon disable" icon="arrowForward" />
            </Flex>
            <Divider />
            <Flex justifyContent="space-between" height="24px" margin="10px 0px">
              <Text className="option disable">{t('settings.user_agreement')}</Text>
              <IconButton className="option-icon disable" icon="arrowForward" />
            </Flex>
            <Divider />
          </Flex>
        </Flex>
      </Flex>
      <STFooter iconActive="settings" />
    </Flex>
  );
};

export default Settings;
