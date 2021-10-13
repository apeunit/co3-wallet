import React, { useEffect, useState } from 'react';
import { Flex } from 'rebass';
import CreateInputStep from '../../StepsComponents/CreateInputStep';
import { useTranslation } from 'react-i18next';
import { SelectInput } from 'src/components/Select';
import { useSelector } from 'react-redux';
import { COUPON_PURPOSE } from 'src/config';

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
      console.log("tokenlistoption1", tokenListOption)
      console.log("tokenlist1", tokenList)

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenList]);



  const currentToken = () => {
    if (!token) return null;
    console.log("current token", currentToken)
    return tokenList.find((item: any) => item.contractAddress === token);
  }

  console.log("tokenlist2", tokenList)
  console.log("tokenlistoption2", tokenListOption)
  console.log("current token", currentToken)

  return (
    <Flex flexDirection="column" width="100%">
      <SelectInput
        type="number"
        value={crowdsale.itemToSell}
        onChangeValue={(e: any) => {
          setToken(e);
          handleChangeCrowdsale(e, 'itemToSell')
        }}
        label=""
        className="crowdsale-itemToSell"
        placeholder={t('new_crowdsale.item_to_sell')}
        msg={t('new_crowdsale.item_sell_msg')}
        error={error}
        data={tokenListOption}
      />
      <Flex margin="30px 0px">
        <CreateInputStep
          type="number"
          value={crowdsale.maxSupply}
          onChangeValue={(e: any) => {
            const value = Number(e);
            const current = currentToken();

            if (!current || current.amount < value) return null;

            handleChangeCrowdsale(e, 'maxSupply')
          }}
          label=""
          placeholder={t('new_crowdsale.max_supply')}
          maxLength=""
          msg={t('new_crowdsale.sell_question')}
          error={error}
          autoFocus={true}
          className="crowdsale-maxSupply-input"
          handleKeyChange={_handleKeyDown}
          disabled={!token}
        />
      </Flex>
    </Flex>
  );
};

export default SupplyStep;
