import React from 'react';
import { Button, Flex, Text } from 'rebass';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IconButton from 'src/components/IconButton';
import '../assets/styles/Setting.css';

const RecoveryPhrase = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handlebackStep = () => {
    history.push('/settings');
  };

  return (
    <Flex
      flexDirection="column"
      height="100vh"
      paddingBottom={3}
      justifyContent="flex-start"
      className="recovery-phrase"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        paddingY={4}
        style={{ top: 0, left: 0, width: '100%', zIndex: 100 }}
      >
        <IconButton onClick={handlebackStep} sx={{ cursor: 'pointer' }} icon="back" />
        <Text style={{ fontWeight: 600, lineHeight: '22px' }} fontSize="18px">
          {t('recovery_phrase.label')}
        </Text>
        <div />
      </Flex>
      <Flex margin="0px auto 30px" width="320px" height="400px" style={{ background: '#C4C4C4' }}>
        <Text className="placeholder-text">{t('recovery_phrase.placeholder')}</Text>
      </Flex>
      <Flex flexDirection="column">
        <Flex className="welcome-text" width="328px" margin="20px auto" flexDirection="column">
          <Text>
            {t('recovery_phrase.welcome_label')}
            <a className="co3-link" href="/">
              {t('recovery_phrase.co3_wallet')}!
            </a>
          </Text>
          <Text>{t('recovery_phrase.welcome_msg')}</Text>
        </Flex>
        <Button onClick={() => history.push('/new-wallet')} className="new-wallet-btn">
          {t('recovery_phrase.new_wallet')}
        </Button>
        <Button onClick={() => history.push('/import-wallet')} className="import-btn">
          {t('recovery_phrase.import_wallet')}
        </Button>
      </Flex>
    </Flex>
  );
};

export default RecoveryPhrase;
