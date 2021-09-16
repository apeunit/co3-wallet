import React, { useEffect, useState } from 'react';
import { Flex } from 'rebass';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { SelectInput } from 'src/components/Select';
import CreateInputStep from '../../StepsComponents/CreateInputStep';
import { COUPON_PURPOSE } from 'src/config';

interface IProps {
  pickupbasket: any;
  error: string;
  _handleKeyDown(event: any): void;
  handleChangePickupbasket(event: any, key: string): void;
}

const SupplyStep: React.FC<IProps> = ({
  pickupbasket,
  error,
  _handleKeyDown,
  handleChangePickupbasket,
}) => {
  const { t } = useTranslation();
  const [tokenListOption, setTokenListOption]: any = useState([]);
  const [token, setToken] = useState(null)
  const { tokenList } = useSelector(({ chain }: any) => {
    return {
      tokenList: chain.tokenList,
    };
  });

  useEffect(() => {
    if (tokenList) {
      if (tokenList.length > 0) {
        tokenList.map((token: any) => {
          return (token.decimals === 0 || token.purpose === COUPON_PURPOSE) && !tokenListOption.find((tk: any) => tk.key === token.contractAddress)
            ? tokenListOption.push({ key: token.contractAddress, title: token.name })
            : tokenListOption;
        });
      }
      setTokenListOption(tokenListOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenList]);

  const currentToken = () => {
    if (!token) return null;
    return tokenList.find((item: any) => item.contractAddress === token);
  }

  return (
    <Flex flexDirection="column" width="100%">
      <SelectInput
        type="number"
        value={pickupbasket.couponToGive}
        onChangeValue={(e: any) => {
          setToken(e);
          handleChangePickupbasket(e, 'couponToGive')
        }}
        label=""
        className="pickupbox-itemToSell"
        placeholder={t('new_pickupbox.coupon_to_give')}
        msg={t('new_pickupbox.item_sell_msg')}
        error={error}
        data={tokenListOption}
      />
      <Flex margin="30px 0px">
        <CreateInputStep
          type="number"
          value={pickupbasket.productsAvailable}
          onChangeValue={(e: any) => {
            const value = Number(e);
            const current = currentToken();
            if (!current || current.amount < value) return null;
            handleChangePickupbasket(e, 'productsAvailable')
          }}
          label=""
          placeholder={t('new_pickupbox.product_available')}
          maxLength=""
          msg={t('new_pickupbox.sell_question')}
          error={error}
          autoFocus={true}
          className="pickupbasket-productsAvailable-input"
          handleKeyChange={_handleKeyDown}
          disabled={!token}
        />
      </Flex>
    </Flex>
  );
};

export default SupplyStep;
