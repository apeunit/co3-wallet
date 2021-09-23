/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import InfoBar from '../components/InfoBar';
import Badge from '../components/Badge';
import AvatarBadge from '../components/AvatarBadge';
import { Flex } from 'rebass';
import InputField from '../components/InputField';
import { useHistory, useLocation } from 'react-router-dom';
import ToolBar from '../components/ToolBar';
import ToolBarTitle from '../components/ToolBarTitle';
import IconButton from '../components/IconButton';
import { useDispatch } from 'react-redux';
import { setModalData } from '../redux/actions/Modal';
import { useTranslation } from 'react-i18next';
import Loading from '../components/Loading';
import ErrorMsg from 'src/components/ErrorMsg';
import { useSelector } from 'react-redux';
import { approveSender, refillPickupBox } from 'src/redux/actions/Chain';

function useQueryParam() {
  return new URLSearchParams(useLocation().search);
}

const Refill = () => {
  const { t } = useTranslation();
  const [supply, setSupply] = useState<number>();
  const [loader, setLoader] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [token, setToken] = useState<any>(undefined);

  const queryParams = useQueryParam();

  const { tokenList } = useSelector(({ chain }: any) => {
    return {
      tokenList: chain.tokenList,
    };
  });

  useEffect(() => {
    if (tokenList && tokenList.length) {
      const tokenAddress = queryParams.get('coupon');
      const element = tokenList.find((el: any) => el.contractAddress === tokenAddress);

      if (element) {
        const data = element.logoURL && element.logoURL.includes('description') ? JSON.parse(element.logoURL) : {};
        setToken({
          ...element,
          ...data
        })
      }
    }
  }, [tokenList]);

  const handleConfirm = async () => {
    const contractAddress = queryParams.get('to') || '';

    if (!supply || supply <= 0 || !contractAddress) return;

    setLoader(true);
    try {
      await dispatch(approveSender(token, contractAddress, Number(supply)));

      await dispatch(refillPickupBox(
        contractAddress,
        Number(supply)
      ));

      setLoader(false);
      dispatch(
        setModalData(
          true,
          t('pickupbasketplace.refill_success'),
          t('common.transaction_complete'),
          'permission',
        ),
      );
      history.goBack();
    } catch (err) {
      const e = err as any;
      setLoader(false);
      console.log('refill-error', e);
      dispatch(
        setModalData(
          true,
          t('pickupbasketplace.refill_failed'),
          e.message.split('\n')[0],
          'permission',
        ),
      );
    }
  };

  const onKeySupply = (e: any) => {
    e.preventDefault();
    if (e.key === '.' || e.key === 'e') {
      setError(t('pickupbasketplace.coupon_decimal_error'))

      return false;
    } else {
      setError('');
    }
  };

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="90vh">
      <Loading loader={loader} />
      <Flex flexDirection="column">
        <ToolBar>
          <IconButton
            icon="back"
            onClick={() => {
              history.goBack();
            }}
          />
          <ToolBarTitle fontWeight="500">{t('pickupbasketplace.refill_page_title')}</ToolBarTitle>
        </ToolBar>
        {token && (
          <InfoBar>
            <Badge>{token?.token_symbol}</Badge>
            <AvatarBadge image={token?.logoURL} label={token?.name} />
          </InfoBar>
        )}
      </Flex>
      <Flex padding={7}>
        <InputField
          type="number"
          className="token-mint-input"
          label={t('new_pickupbox.product_available')}
          placeholder={t('minting.supply_coupon_placeholder')}
          value={supply || ''}
          handleKeyChange={onKeySupply}
          onChangeValue={(e: number) => {
            if (e <= (token?.amount || 0)) {
              setSupply(e);
            }
          }}
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

export default Refill;
