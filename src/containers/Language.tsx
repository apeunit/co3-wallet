import React from 'react';
import { Flex, Text } from 'rebass';
import { useTranslation } from 'react-i18next';
import '../assets/styles/Setting.css';
import IconButton from 'src/components/IconButton';
import { Divider } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { languages } from './TokenRadioText';

const Language: React.FC = () => {
  const history = useHistory();
  const { i18n, t } = useTranslation();

  const handleLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const _renderLangugages = (lng: any) => (
    <Flex
      onClick={() => handleLanguage(lng.code)}
      justifyContent="space-between"
      height="24px"
      margin="10px 0px"
    >
      <Text className="option">{t(`settings.${lng.title}`)}</Text>
      {i18n.language === lng.code && (
        <IconButton className="language-blue-icon" icon="checkCircleRounded" />
      )}
    </Flex>
  );

  const handlebackStep = () => {
    history.push('/settings');
  };

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
        <Flex
          justifyContent="space-between"
          alignItems="center"
          paddingY={4}
          style={{ top: 0, left: 0, width: '100%', zIndex: 100 }}
        >
          <IconButton onClick={handlebackStep} sx={{ cursor: 'pointer' }} icon="back" />
          <Text style={{ fontWeight: 600, lineHeight: '22px' }} fontSize="18px">
            {t('settings.language')}
          </Text>
          <div />
        </Flex>
        <Flex
          flexDirection="column"
          margin="0px auto 20px"
          width="42vh"
          className="identity-section"
        >
          {languages.map((languge: any, index: number) => (
            <div key={index}>
              {_renderLangugages(languge)}
              <Divider />
            </div>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Language;
