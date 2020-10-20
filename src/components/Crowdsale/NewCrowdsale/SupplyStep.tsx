import React, { useEffect, useState } from 'react';
import { Flex } from 'rebass';
import CreateInputStep from '../../StepsComponents/CreateInputStep';
import { useTranslation } from 'react-i18next';
import { SelectInput } from 'src/components/Select';
import { useSelector } from 'react-redux';

interface IProps {
  crowdsale: any;
  error: string;
  _handleKeyDown(event: any): void;
  handleChangeCrowdsale(event: any, key: string): void;
}

const SupplyStep: React.FC<IProps> = ({
  crowdsale,
  error,
  _handleKeyDown,
  handleChangeCrowdsale,
}) => {
  const { t } = useTranslation();
  const [tokenListOption, setTokenListOption]: any = useState([]);
  const { tokenList } = useSelector(({ chain }: any) => {
    return {
      tokenList: chain.tokenList,
    };
  });

  useEffect(() => {
    if (tokenList) {
      if (tokenList.length > 0) {
        tokenList.map((token: any) => {
          return token.decimals === 0
            ? tokenListOption.push({ key: token.contractAddress, title: token.name })
            : tokenListOption;
        });
      }
      setTokenListOption(tokenListOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenList]);

  return (
    <Flex flexDirection="column" width="100%">
      <Flex margin="30px 0px">
        <CreateInputStep
          type="number"
          value={crowdsale.maxSupply}
          onChangeValue={(e: any) => handleChangeCrowdsale(e, 'maxSupply')}
          label=""
          placeholder={t('new_crowdsale.max_supply')}
          maxLength=""
          msg={t('new_crowdsale.sell_question')}
          error={error}
          autoFocus={true}
          className="crowdsale-maxSupply-input"
          handleKeyChange={_handleKeyDown}
        />
      </Flex>
      <SelectInput
        type="number"
        value={crowdsale.itemToSell}
        onChangeValue={(e: any) => handleChangeCrowdsale(e, 'itemToSell')}
        label=""
        className="crowdsale-itemToSell"
        placeholder={t('new_crowdsale.item_to_sell')}
        msg={t('new_crowdsale.item_sell_msg')}
        error={error}
        data={tokenListOption}
      />
    </Flex>
  );
};

export default SupplyStep;
