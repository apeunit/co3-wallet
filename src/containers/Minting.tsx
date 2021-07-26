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
import ErrorMsg from 'src/components/ErrorMsg';
import { COUPON_PURPOSE } from 'src/config';

const Minting = () => {
  const { t } = useTranslation();
  const [supply, setSupply] = useState<number>();
  const [loader, setLoader] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const [error, setError] = useState('');

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
              true,
              t(parseInt(token?.decimals, 10) === 0 ? 'minting.coupon_mint_info' : 'minting.token_mint_info'),
              t('common.transaction_complete'),
              'permission',
            ),
          );
        })
        .catch((err: any) => {
          setLoader(false);
          console.log(err, 'Mint');
          dispatch(
            setModalData(
              true,
              t(parseInt(token?.decimals, 10) === 0 ? 'minting.coupon_mint_failed' : 'minting.token_mint_failed'),
              err.message.split('\n')[0],
              'permission',
            ),
          );
        });
    }
  };

  const onKeySupply = (e: any) => {
    e.preventDefault();
    if (e.key === '.' && parseInt(token?.decimals, 10) === 0) {
      setError(t('minting.coupon_mint_decimal_error'))

      return false;
    } else {
      setError('');
    }
  }

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="90vh">
      <Loading loader={loader} />
      <Flex flexDirection="column">
        <ToolBar>
          <IconButton
            icon="back"
            onClick={() => {
              history.push({ pathname: `${parseInt(token?.decimals, 10) === 0 ?  '/coupon-detail' : '/token-detail'}`, state: { token } });
            }}
          />
          <ToolBarTitle fontWeight="500">{token?.purpose === COUPON_PURPOSE ?  t('minting.mint_coupon') : t('minting.mint_token')}</ToolBarTitle>
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
          className="token-mint-input"
          label={t('common.supply')}
          placeholder={token?.decimals === 0 ? t('minting.supply_coupon_placeholder') : t('minting.supply_placeholder')}
          value={supply || ''}
          handleKeyChange={onKeySupply}
          msg={parseInt(token?.decimals, 10) === 0 ? t('minting.coupon_mint_decimal_error') : ''}
          onChangeValue={setSupply}
        />
      </Flex>
      <Flex justifyContent="center" marginBottom={4} minHeight="70px">
        {error ? (
          <ErrorMsg style={{ top: '87vh' }} title={error} type="warning" />
        ) :
        (
          <IconButton
            icon="next"
            className="token-mint-next-btn"
            marginBottom={5}
            size="s14"
            backgroundColor="blue600"
            color="white"
            onClick={handleConfirm}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default Minting;
