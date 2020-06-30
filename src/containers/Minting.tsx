import React, { useState } from 'react';
import InfoBar from '../components/InfoBar';
import Badge from '../components/Badge';
import AvatarBadge from '../components/AvatarBadge';
import { Flex } from 'rebass';
import InputField from '../components/InputField';
import { useHistory } from 'react-router-dom';
import ToolBar from '../components/ToolBar';
import ToolBarTitle from '../components/ToolBarTitle';
import IconButton from '../components/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { mintNewToken } from '../redux/actions/Chain';
import { setModalData } from '../redux/actions/Modal';
import { useTranslation } from 'react-i18next';
import Loading from '../components/Loading';

const Minting = () => {
  const { t } = useTranslation();
  const [supply, setSupply] = useState<number>();
  const [loader, setLoader] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const { token } = useSelector(({ wallet }: any) => {
    return {
      token: wallet.transfer.token,
    };
  });

  const handleConfirm = () => {
    setLoader(true);
    if (supply) {
      const receipt: any = dispatch(mintNewToken(token, supply));
      receipt
        .then((res: any) => {
          setLoader(false);
          history.push('/');
          dispatch(
            setModalData(
              t('minting.token_mint_info'),
              t('common.transaction_complete'),
              'permission',
            ),
          );
        })
        .catch((err: any) => {
          setLoader(false);
          console.log(err, 'Mint');
          dispatch(
            setModalData(true, t('minting.token_mint_failed'), err.message.split('\n')[0], 'permission'),
          );
        });
    }
  };

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="100vh">
      <Loading loader={loader} />
      <Flex flexDirection="column">
        <ToolBar>
          <IconButton
            icon="back"
            onClick={() => {
              history.push({ pathname: '/token-detail', state: { token } });
            }}
          />
          <ToolBarTitle fontWeight="500">{t('multitoken.label')}</ToolBarTitle>
        </ToolBar>
        {token && (
          <InfoBar>
            <Badge>{token.token_symbol}</Badge>
            <AvatarBadge image={token.logoURL} label={token.name} />
          </InfoBar>
        )}
      </Flex>
      <Flex padding={7}>
        <InputField
          type="number"
          label={t('common.supply')}
          placeholder={t('minting.supply_placeholder')}
          value={supply || undefined}
          onChangeValue={setSupply}
        />
      </Flex>
      <Flex justifyContent="center" marginBottom={4}>
        <IconButton
          icon="next"
          marginBottom={5}
          size="s14"
          backgroundColor="blue600"
          color="white"
          onClick={handleConfirm}
        />
      </Flex>
    </Flex>
  );
};

export default Minting;
