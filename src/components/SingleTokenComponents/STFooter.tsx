import React, { useState } from 'react';
import { Flex, Text } from 'rebass';
import IconButton from '../IconButton';
import '../../assets/styles/NewToken.css';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

interface IProps {
  iconActive: string;
}

const STFooter: React.FC<IProps> = ({ iconActive }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [active, setActive] = useState(iconActive);

  const changeTab = (icon: string, url: string) => {
    setActive(icon);
    history.push(url);
  };

  const icons = [
    {
      label: t('new_crowdsale.marketplace'),
      icon: 'sellIcon',
      url: '/marketplace',
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
    },
  ];

  return (
    <Flex
      height="70px"
      backgroundColor="white"
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
      paddingX={7}
      paddingTop={5}
      style={{ zIndex: 0 }}
      className="wallet-footer"
    >
      {icons.map(({ icon, label, url }: any, index: number) =>
        active === icon ? (
          <Flex
            key={index}
            className="token-footer-icon"
            height="40px"
            width={icon === 'sellIcon' ? '130px': '105px'}
            backgroundColor="blue100"
            sx={{ borderRadius: 'full' }}
          >
            <Flex width="max-content" margin="0px auto">
              <IconButton className="footer-icon-active" paddingBottom="10px" icon={icon} />
              <Text fontSize={13} marginTop="10px" color="blue600">
                {label}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <IconButton
            className={`footer-icon ${icon}`}
            onClick={() => changeTab(icon, url)}
            key={index}
            icon={icon}
          />
        ),
      )}
    </Flex>
  );
};

export default STFooter;
