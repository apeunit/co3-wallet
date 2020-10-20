import React from 'react';
import { Flex, Text } from 'rebass';
import { useTranslation } from 'react-i18next';
import '../assets/styles/Setting.css';
import IconButton from 'src/components/IconButton';
import { useHistory } from 'react-router-dom';
import { Slider } from 'src/components/Slider';
import { useDispatch } from 'react-redux';
import { setModalData } from '../redux/actions/Modal';

const DeleteWallet: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handlebackStep = () => {
    history.push('/');
  };

  const handleDeleteWallet = () => {
    localStorage.removeItem('co3-app-mnemonic');
    history.push('/settings');
    dispatch(setModalData(true, t('settings.delete_wallet_success'), '', 'permission'));
  };

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100vh"
      style={{ overflow: 'hidden' }}
      justifyContent="space-between"
      className="delete-wallet"
    >
      <Flex flexDirection="column" margin="0px" height="100vh" justifyContent="space-between">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          paddingY={4}
          style={{ top: 0, left: 0, width: '100%', zIndex: 100 }}
        >
          <IconButton onClick={handlebackStep} sx={{ cursor: 'pointer' }} icon="back" />
          <Text style={{ fontWeight: 600, lineHeight: '22px' }} fontSize="18px">
            {t('settings.delete_wallet')}
          </Text>
          <div />
        </Flex>
        <Flex flexDirection="column" justifyContent="space-between">
          <Flex>
            <IconButton
              style={{ height: '200px', width: '100%' }}
              className="warning-btn"
              icon="warning"
            />
          </Flex>
          <Flex flexDirection="column" className="delete_txt">
            <Text>
              <div dangerouslySetInnerHTML={{ __html: t('settings.delete_wallet_txt') }} />
            </Text>
          </Flex>
        </Flex>
        <Flex marginRight="10px" marginBottom="30px" justifyContent="center">
          <Slider
            dragEnd={handleDeleteWallet}
            onClick={handleDeleteWallet}
            title="Slide to Delete"
            bgColor="#F9DCE3"
            btnColor="#DD303D"
            txtColor="#757575"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DeleteWallet;
