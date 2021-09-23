import React, { useEffect, useState } from 'react';
import { Flex, Text } from 'rebass';
import IconButton from '../IconButton';
import '../../assets/styles/NewToken.css';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PILOT } from 'src/config';

interface IProps {
  iconActive: string;
}

const STFooter: React.FC<IProps> = ({ iconActive }) => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const [icons, setIcons] = useState([
    {
      label: t('pickupbasketplace.label'),
      icon: 'localOffer',
      url: '/pickupbasketplace',
    },
    {
      label: t('multitoken.label'),
      icon: 'walletIcon',
      url: '/',
    },
    {
      label: t('settings.label'),
      icon: 'settings',
      url: '/settings',
    }
  ]);

  const { _pilot } = useSelector(({ pilot }: any) => {
    return {
      _pilot: pilot,
    };
  });

  const changeTab = (url: string) => {
    history.push(url);
  };
  useEffect(() => {
    if (((_pilot && _pilot.features.indexOf('multiToken') > -1) || PILOT === 'turin') && !icons.find((icon) => icon.url === '/marketplace')) {
      setIcons([
        {
          label: t('marketplace.label'),
          icon: 'sellIcon',
          url: '/marketplace',
        },
        ...icons,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_pilot]);

  // console.log("pilot", _pilot)

  return (
    <Flex
      height="70px"
      backgroundColor="white"
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
      paddingX={7}
      paddingTop={5}
      style={{ zIndex: 20 }}
      className="wallet-footer"
    >
      {icons.map(({ icon, label, url }: any, index: number) =>
        url === location.pathname ? (
          <Flex
            key={`selected-${index}`}
            className="token-footer-icon"
            height="40px"
            paddingX="20px"
            backgroundColor="blue100"
            sx={{ borderRadius: 'full' }}
          >
            <Flex width="max-content" margin="0px auto">
              <IconButton className="footer-icon-active" paddingBottom="10px" icon={icon} />
              <Text fontSize={13} marginTop="10px" color="blue600">
                {label.replace(/\s/g, '')}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <IconButton
            className={`footer-icon ${icon}`}
            onClick={() => changeTab(url)}
            key={`icons-${index}`}
            icon={icon}
          />
        ),
      )}
    </Flex>
  );
};

export default STFooter;
